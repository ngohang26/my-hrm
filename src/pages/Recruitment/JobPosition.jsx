import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Form/FormComponent.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal.jsx'
import { FiTrash, FiEdit } from 'react-icons/fi';
import { apiUrl } from '../../config'
import { Helmet, HelmetProvider } from 'react-helmet-async';

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

async function fetchPositions() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${apiUrl}/positions/getAllPositions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  const positions = await response.json();
  return positions;
}

async function addJobPosition(jobPosition) {
  const token = localStorage.getItem('accessToken');
  const jobPositionData = {
    ...jobPosition,
    position: { id: jobPosition.position },
  };
  console.log('Data being sent to server:', jobPositionData); // Log data here
  try {
    const response = await fetch(`${apiUrl}/jobPositions/addJobPosition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(jobPositionData)
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
  const jobPositionData = {
    ...jobPositionDetails,
    position: { id: jobPositionDetails.position },
  };
  console.log('Data being sent to server:', jobPositionData); // Log data here
  try {
    const response = await fetch(`${apiUrl}/jobPositions/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(jobPositionData)
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
  const [positions, setPositions] = useState([])
  const addJobPositionColumns = [
    { field: 'jobPositionName', headerName: 'Vị trí ứng tuyển'},
    {
      field: 'position',
      headerName: 'Chức vụ',
      type: 'select',
      options: positions.map(position => ({ id: position.id, name: position.positionName })),
    },
    { field: 'skillsRequired', headerName: 'Yêu cầu', flex: 2.5, },
    { field: 'applicationDeadline', headerName: 'Thời hạn', flex: 2.5, type: Date},
  ];

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
        position: data.position,
        jobPositionName: data.jobPositionName,
        skillsRequired: data.skillsRequired,
        applicationDeadline: data.applicationDeadline
      };
      if (!editing.id) {
        await addJobPosition(jobPositionDetails, data);
        const updatedJobPositions = await fetchJobPositions();
        
        setJobPositions(updatedJobPositions);
        setIsFormOpen(false);
        setEditing({});
      } else {
        await editJobPosition(editing.id, jobPositionDetails);
        
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
      const initialPositions = await fetchPositions();
      setPositions(initialPositions);
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
    setEditing({
      ...row,
      position: row.position.id,
    });
    setIsFormOpen(true);
  };

  const jobPositionColumns = [
    { field: 'order', headerName: 'STT', flex: 0.5, },
    { field: 'jobPositionName', headerName: 'VỊ TRÍ ỨNG TUYỂN', flex: 2.2},
    {
      field: 'positionName', headerName: 'CHỨC VỤ', flex: 1.5,
      valueGetter: (params) => params.row.position.positionName
    },
    {
      field: 'jobSummary', headerName: 'MÔ TẢ', flex: 1.5,
      valueGetter: (params) => params.row.position.jobSummary
    },
    { field: 'skillsRequired', headerName: 'YÊU CẦU', flex: 2.5, },
    { field: 'applicationDeadline', headerName: 'THỜI HẠN', flex: 1, },
    {
      field: 'actions', headerName: 'HÀNH ĐỘNG', flex: 1, renderCell: (params) => (
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
    <HelmetProvider>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Helmet>
          <title>Vị trí tuyển dụng</title>
        </Helmet>
        <div className='jobPositions' style={{ width: '75vw' }}>
          <ToastContainer />
          <h4></h4>
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
    </HelmetProvider>


  );
}

export default JobPosition
