import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import './Allowance.css'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Add/FormComponent.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal.jsx';
import { FiTrash, FiEdit } from 'react-icons/fi';
import EmployeeAllowance from './EmployeeAllowance.jsx';
import { apiUrl } from '../../config.js';

const addAllowanceColumns = [
  { field: 'allowanceName', headerName: 'Tên trợ cấp', flex: 2.5, },
  { field: 'allowanceAmount', headerName: 'Số tiền', flex: 1.3, },
];

// const apiUrl = 'https://c870-116-98-34-179.ngrok-free.app'; 

async function fetchAllowances() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${apiUrl}/allowance/getAllAllowances`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const allowances = await response.json();
  return allowances.map((allowance, index) => ({
    order: index + 1,  
    id: index,
    ...allowance,
  }));
}


async function addAllowance(allowance) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/allowance/addAllowance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(allowance)
    });

    if (response.ok) {
      toast.success('Thêm trợ cấp thành công');
    } else if (response.status === 500) {
      toast.error('Tên trợ cấp không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Trợ cấp đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to add allowance:', error);
  }
}

async function editAllowance(id, allowanceDetails) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/allowance/updateAllowance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(allowanceDetails)
    });

    if (response.ok) {
      toast.success('Sửa trợ cấp thành công');
    } else if (response.status === 500) {
      toast.error('Tên trợ cấp không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Trợ cấp đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to update allowance:', error);
  }
}

async function deleteAllowance(id) {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${apiUrl}/allowance/hardDelete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete allowance:', error);
  }
}
const Allowance = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [allowances, setAllowances] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [allowanceToDelete, setAllowanceToDelete] = useState(null);
  const [editing, setEditing] = useState({});

  const openDeleteModal = (id) => {
    setAllowanceToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const handleConfirmDelete = async () => {
    if (allowanceToDelete !== null) {
      await deleteAllowance(allowanceToDelete);
      const updatedAllowances = await fetchAllowances();
      setAllowances(updatedAllowances);
    }
    closeDeleteModal();
  };

  const allowanceColumns = [
    { field: 'order', headerName: 'STT', flex: 1, },
    { field: 'allowanceName', headerName: 'Tên trợ cấp', flex: 2.5, },
    { field: 'allowanceAmount', headerName: 'Số tiền', flex: 1.3, },
    {
      field: 'actions',
      headerName: 'Hành động',
      flex: 1,
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleEdit(params.row)} className='btn-action'>        
            <FiEdit color='#000'/>
          </button>
          {/* <button onClick={() => openDeleteModal(params.row.id)} className='btn-action'>
            <FiTrash color='#ff0000'/>
          </button> */}
        </div>
      ),
    },
  ];
  const handleFormSubmit = async (data) => {
    try {
      const allowanceDetails = {
        allowanceName: data.allowanceName,
        allowanceAmount: data.allowanceAmount
      };
      if (!editing.id) {
        await addAllowance(allowanceDetails, data);
        const updatedAllowances = await fetchAllowances();
        setAllowances(updatedAllowances);
        setIsFormOpen(false);
        setEditing({});
      } else {
        await editAllowance(editing.id, data);
        const updatedAllowances = await fetchAllowances();

        setAllowances(updatedAllowances);

        setIsFormOpen(false);
        setEditing({});
      }
    } catch (error) {
      console.error('Failed to add or update allowance:', error);
    }
 }
  useEffect(() => {
    const fetchInitialData = async () => {
      const initialAllowances = await fetchAllowances();
      setAllowances(initialAllowances);
    }

    fetchInitialData();
  }, []);
  const openForm = () => {
    setIsFormOpen(true);
  }

  const closeForm = (event) => {
    if (event.target === event.currentTarget) {
      setIsFormOpen(false);
      setEditing({});
    }
  }

  const handleEdit = (row) => {
    setEditing(row)
    setIsFormOpen(true)
};
  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <ToastContainer/>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>Trợ cấp của nhân viên</Tab>      
      </TabList>

      <TabPanel style={{display: 'flex', justifyContent: 'center'}}>
        <div className='allowances'>
        <div className='info'>
          <button onClick={openForm} className='btn-add'>+ Thêm</button>
        </div>
        <DataTable columns={allowanceColumns} data={allowances} slug="allowance" showEditColumn={false}/>;
        {isFormOpen && (
          <div className="overlay" onClick={closeForm}>
            <FormComponent fields={addAllowanceColumns} onSubmit={handleFormSubmit} onCancel={closeForm} 
            initialValues={editing}
            />
          </div>
        )}
        <ConfirmDeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={closeDeleteModal} />
        </div>
      </TabPanel>
      <TabPanel>
        <EmployeeAllowance/>
      </TabPanel>
      </Tabs>

  );
}

export default Allowance
