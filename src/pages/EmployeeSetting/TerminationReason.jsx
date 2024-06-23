import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Form/FormComponent.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal.jsx';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { apiUrl } from '../../config.js';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const addTerminationReasonColumns = [
  { field: 'reason', headerName: 'Lý do' },
];

async function fetchTerminationReasons() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${apiUrl}/terminationReasons/getAllTerminationReason`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const terminationReasons = await response.json();
  return terminationReasons.map((terminationReason, index) => ({
    order: index + 1,
    id: index,
    ...terminationReason,
  }));
}


async function addTerminationReason(terminationReason) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/terminationReasons/addTerminationReason`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(terminationReason)
    });

    if (response.ok) {
      toast.success('Thêm lý do thành công');
    } else if (response.status === 500) {
      toast.error('Tên lý do không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Lý do đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to add terminationReason:', error);
  }
}

async function editTerminationReason(id, terminationReasonDetails) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/terminationReasons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(terminationReasonDetails)
    });

    if (response.ok) {
      toast.success('Sửa lý do thành công');
    } else if (response.status === 500) {
      toast.error('Tên lý do không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Lý do đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to update terminationReason:', error);
  }
}

async function deleteTerminationReason(id) {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${apiUrl}/terminationReasons/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete terminationReason:', error);
  }
}
const TerminationReason = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [terminationReasons, setTerminationReasons] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [terminationReasonToDelete, setTerminationReasonToDelete] = useState(null);
  const [editing, setEditing] = useState({});

  const openDeleteModal = (id) => {
    setTerminationReasonToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (terminationReasonToDelete !== null) {
      await deleteTerminationReason(terminationReasonToDelete);
      const updatedTerminationReasons = await fetchTerminationReasons();
      setTerminationReasons(updatedTerminationReasons);
    }
    closeDeleteModal();
  };

  const terminationReasonColumns = [
    { field: 'order', headerName: 'STT', flex: 1, },
    { field: 'reason', headerName: 'Lý do', flex: 2.5, },
    {
      field: 'actions',
      headerName: 'Hành động',
      flex: 1,
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleEdit(params.row)} className='btn-action'>
            <FiEdit color='#000' />
          </button>
          <button onClick={() => openDeleteModal(params.row.id)} className='btn-action'>
            <FiTrash color='#ff0000' />
          </button>
        </div>
      ),
    },
  ];
  const handleFormSubmit = async (data) => {
    try {
      const terminationReasonDetails = {
        reason: data.reason,
      };
      if (!editing.id) {
        await addTerminationReason(terminationReasonDetails, data);
        const updatedTerminationReasons = await fetchTerminationReasons();
        setTerminationReasons(updatedTerminationReasons);
        setIsFormOpen(false);
        setEditing({});
      } else {
        await editTerminationReason(editing.id, data);
        const updatedTerminationReasons = await fetchTerminationReasons();

        setTerminationReasons(updatedTerminationReasons);

        setIsFormOpen(false);
        setEditing({});
      }
    } catch (error) {
      console.error('Failed to add or update termination Reason:', error);
    }
  }
  useEffect(() => {
    const fetchInitialData = async () => {
      const initialTerminationReasons = await fetchTerminationReasons();
      setTerminationReasons(initialTerminationReasons);
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
    <HelmetProvider>
      <Helmet>
        <title>Quản lý lý do</title>
      </Helmet>
      <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <ToastContainer />
        <TabList className='tablist'>
          <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
        </TabList>

        <TabPanel style={{ display: 'flex', justifyContent: 'center' }}>
          <div className='allowances'>
            <div className='info'>
              <button onClick={openForm} className='btn-add'>+ Thêm</button>
            </div>
            <DataTable columns={terminationReasonColumns} data={terminationReasons} slug="terminationReason" showEditColumn={false} />;
            {isFormOpen && (
              <div className="overlay" onClick={closeForm}>
                <FormComponent fields={addTerminationReasonColumns} onSubmit={handleFormSubmit} onCancel={closeForm}
                  initialValues={editing}
                />
              </div>
            )}
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={closeDeleteModal} />
          </div>
        </TabPanel>
      </Tabs>
    </HelmetProvider>
  );
}

export default TerminationReason
