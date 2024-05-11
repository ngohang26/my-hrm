import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Add/FormComponent.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal.jsx'
import { FiTrash, FiEdit } from 'react-icons/fi';
import {apiUrl} from '../../config'

const addJobPositionColumns = [
  { field: 'jobPositionName', headerName: 'CHỨC VỤ', flex: 1.5, },
  { field: 'jobDescription', headerName: 'Mô tả công việc', flex: 2.5, },
  { field: 'skillsRequired', headerName: 'Yêu cầu', flex: 2.5, },
  { field: 'applicationDeadline', headerName: 'Thời hạn', flex: 2.5, },
];

async function fetchJobPositions() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${apiUrl}/jobPositions/getAllJobPositions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const jobPositions = await response.json();
  return jobPositions.map((jobPosition, index) => ({
    order: index + 1,
    id: index,
    ...jobPosition,
  }));
}


async function addJobPosition(jobPosition) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/jobPositions/addJobPosition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(jobPosition)
    });

    if (response.ok) {
      toast.success('Thêm vị trí ứng tuyển thành công');
    } else if (response.status === 500) {
      toast.error('Tên vị trí ứng tuyển không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Vị trí ứng tuyển đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to add jobPosition:', error);
  }
}

async function editJobPosition(id, jobPositionDetails) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/jobPositions/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(jobPositionDetails)
    });

    if (response.ok) {
      toast.success('Sửa vị trí ứng tuyển thành công');
    } else if (response.status === 500) {
      toast.error('Tên vị trí ứng tuyển/ mô tả không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Chức vụ đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to update jobPosition:', error);
  }
}

async function deleteJobPosition(id) {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${apiUrl}/jobPositions/hardDelete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete jobPosition:', error);
  }
}

const JobPosition = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobPositions, setJobPositions] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobPositionToDelete, setJobPositionToDelete] = useState(null);
  const [editing, setEditing] = useState({});
  const openDeleteModal = (id) => {
    setJobPositionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (jobPositionToDelete !== null) {
      await deleteJobPosition(jobPositionToDelete);
      const updatedJobPositions = await fetchJobPositions();
      setJobPositions(updatedJobPositions);
    }
    closeDeleteModal();
  };

  const handleFormSubmit = async (data) => {
    try {
      const jobPositionDetails = {
        jobPositionName: data.jobPositionName,
        jobSummary: data.jobSummary
      };
      if (!editing.id) {
        await addJobPosition(jobPositionDetails, data);
        const updatedJobPositions = await fetchJobPositions();
        setJobPositions(updatedJobPositions);
        setIsFormOpen(false);
        setEditing({});
      } else {
        await editJobPosition(editing.id, data);
        const updatedJobPositions = await fetchJobPositions();

        setJobPositions(updatedJobPositions);

        setIsFormOpen(false);
        setEditing({});
      }
    } catch (error) {
      console.error('Failed to add or update jobPosition:', error);
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialJobPositions = await fetchJobPositions();
      setJobPositions(initialJobPositions);
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

  const jobPositionColumns = [
    { field: 'order', headerName: 'STT', flex: 1, },
    { field: 'jobPositionName', headerName: 'CHỨC VỤ', flex: 1.5, },
    { field: 'jobDescription', headerName: 'Mô tả công việc', flex: 2.5, },
    { field: 'skillsRequired', headerName: 'Yêu cầu', flex: 2.5, },
    { field: 'applicationDeadline', headerName: 'Thời hạn', flex: 2.5, },
    {
      field: 'actions', headerName: 'Hành động', flex: 1, renderCell: (params) => (
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
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>

    <div className='jobPositions' style={{ width: '50vw' }}>
      <ToastContainer />
      <h4>Vị trí tuyển dụng</h4>
      <div className='info'>
        <button onClick={openForm} className='btn-add'>+ Thêm</button>
      </div>

      <DataTable columns={jobPositionColumns} data={jobPositions} slug="jobPosition" showEditColumn={false} />;
      {isFormOpen && (
        <div className="overlay" onClick={closeForm}>
          <FormComponent fields={addJobPositionColumns} onSubmit={handleFormSubmit} onCancel={closeForm} initialValues={editing} />
        </div>
      )}
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={closeDeleteModal} />
    </div>
    </div>


  );
}

export default JobPosition
