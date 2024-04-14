import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import './department.css'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Add/FormComponent.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Position from '../positions/Position.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal.jsx';
import { FiTrash, FiEdit } from 'react-icons/fi';

const addDepartmentColumns = [
  { field: 'departmentName', headerName: 'Tên bộ phận', flex: 2.5, },
  { field: 'managerCode', headerName: 'Mnv manager', flex: 1.3, },
];


async function fetchDepartments() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:8080/departments/getAllDepartments', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const departments = await response.json();
  return departments.map((department, index) => ({
    order: index + 1,  
    id: index,
    ...department,
  }));
}


async function addDepartment(department, employeeCode) {
  const encodedEmployeeCode = encodeURIComponent(employeeCode);
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`http://localhost:8080/departments/addDepartment?employeeCode=${encodedEmployeeCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(department)
    });

    if (response.ok) {
      toast.success('Thêm bộ phận thành công');
    } else if (response.status === 409) {
      toast.error('Bộ phận đã tồn tại');
    } else if (response.status === 404) {
      toast.error('Mã nhân viên không hợp lệ');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to add department:', error);
  }
}

async function editDepartment(id, departmentDetails) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`http://localhost:8080/departments/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(departmentDetails)
    });

    if (response.ok) {
      toast.success('Sửa bộ phận thành công');
    } else if (response.status === 409) {
      toast.error('Bộ phận đã tồn tại');
    } else if (response.status === 404) {
      toast.error('Mã nhân viên không hợp lệ');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to update department:', error);
  }
}


async function deleteDepartment(id) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`http://localhost:8080/departments/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete department:', error);
  }
}
const Department = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [editing, setEditing] = useState({});

  const openDeleteModal = (id) => {
    setDepartmentToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const handleConfirmDelete = async () => {
    if (departmentToDelete !== null) {
      await deleteDepartment(departmentToDelete);
      const updatedDepartments = await fetchDepartments();
      setDepartments(updatedDepartments);
    }
    closeDeleteModal();
  };

  const departmentColumns = [
    { field: 'order', headerName: 'STT', flex: 1, },
    { field: 'departmentName', headerName: 'Tên bộ phận', flex: 2.5, },
    { field: 'managerCode', headerName: 'Mnv manager', flex: 1.3, },
    { field: 'managerName', headerName: 'Manager', flex: 2.5, },
    { field: 'employeeCount', headerName: 'Tổng NV', flex: 1, },
    {
      field: 'actions',
      headerName: 'Hành động',
      flex: 1,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleEdit(params.row)}>        
            <FiEdit color='#000'/>
          </button>
          <button onClick={() => openDeleteModal(params.row.id)}>
            <FiTrash color='#ff0000'/>
          </button>
        </div>
      ),
    },
  ];
  const handleFormSubmit = async (data) => {
    try {
      const departmentDetails = {
          departmentName: data.departmentName,
          manager: {
              employeeCode: data.managerCode
          }
      };
      if (!editing.id) {
        await addDepartment(departmentDetails, data.managerCode);
        const updatedDepartments = await fetchDepartments();
        setDepartments(updatedDepartments);
        setIsFormOpen(false);
        setEditing({});
      } else {
        // update
        await editDepartment(editing.id, departmentDetails, data.managerCode);  
        const updatedDepartments = await fetchDepartments();

        setDepartments(updatedDepartments);
      
        setIsFormOpen(false);
        setEditing({});
      }
    } catch (error) {
      console.error('Failed to add or update department:', error);
    }
  }
  useEffect(() => {
    const fetchInitialData = async () => {
      const initialDepartments = await fetchDepartments();
      setDepartments(initialDepartments);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const handleEdit = (row) => {
    setEditing(row)
    setIsFormOpen(true)
};
  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <ToastContainer/>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Bộ phận</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>Chức vụ</Tab>      
      </TabList>

      <TabPanel>
        <div className='departments'>
        <div className='info'>
          <button onClick={openForm} className='btn-add'>+ Thêm</button>
        </div>
        <DataTable columns={departmentColumns} data={departments} slug="department" showEditColumn={false}/>;
        {isFormOpen && (
          <div className="overlay" onClick={closeForm}>
            <FormComponent fields={addDepartmentColumns} onSubmit={handleFormSubmit} onCancel={closeForm} 
            initialValues={editing}
            />
          </div>
        )}
        <ConfirmDeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={closeDeleteModal} />
        </div>
      </TabPanel>
      <TabPanel>
        <Position/>
      </TabPanel>
      </Tabs>

  );
}

export default Department
