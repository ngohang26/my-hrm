import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Form/FormComponent.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal.jsx'
import { FiTrash, FiEdit } from 'react-icons/fi';
import { apiUrl } from '../../config.js';
import { Helmet, HelmetProvider } from 'react-helmet-async';

async function fetchDepartments() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${apiUrl}/departments/getAllDepartments`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  const departments = await response.json();
  return departments;
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
  return positions.map((position, index) => ({
    order: index + 1,
    id: index,
    ...position,
  }));
}


async function addPosition(position) {
  const token = localStorage.getItem('accessToken');
  const positionData = {
    ...position,
    department: { id: position.department },
  };
  console.log('Data being sent to server:', positionData); // Log data here
  try {
    const response = await fetch(`${apiUrl}/positions/addPosition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(positionData)
    });
    if (response.ok) {
      toast.success('Thêm chức vụ thành công');
    } else if (response.status === 500) {
      toast.error('Tên chức vụ/ mô tả không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Chức vụ đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to add position:', error);
  }
}

async function editPosition(id, positionDetails) {
  const token = localStorage.getItem('accessToken');
  const positionData = {
    ...positionDetails,
    department: { id: positionDetails.department },
  };
  console.log('Data being sent to server:', positionData); // Log data here
  try {
    const response = await fetch(`${apiUrl}/positions/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(positionData)
    });

    if (response.ok) {
      toast.success('Sửa chức vụ thành công');
    } else if (response.status === 500) {
      toast.error('Tên chức vụ/ mô tả không hợp lệ');
    } else if (response.status === 409) {
      toast.error('Chức vụ đã tồn tại');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to update position:', error);
  }
}

async function deletePosition(id) {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${apiUrl}/positions/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      toast.error(responseData.message);
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    toast.success('Xóa chức vụ thành công');
  } catch (error) {
    console.error('Failed to delete position:', error);
  }
}

const Position = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [editing, setEditing] = useState({});
  const [departments, setDepartments] = useState([]);
  const openDeleteModal = (id) => {
    setPositionToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const addPositionColumns = [
    {
      field: 'positionName',
      headerName: 'CHỨC VỤ',
      flex: 1.5,
    },
    {
      field: 'jobSummary',
      headerName: 'TÓM TẮT',
      flex: 2.5,
    },
    {
      field: 'department',
      headerName: 'PHÒNG BAN',
      type: 'select',
      options: departments.map(department => ({ id: department.id, name: department.departmentName })),
    },
  ];
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (positionToDelete !== null) {
      await deletePosition(positionToDelete);
      const updatedPositions = await fetchPositions();
      setPositions(updatedPositions);
    }
    closeDeleteModal();
  };
  const handleFormSubmit = async (data) => {
    try {
      const positionDetails = {
        positionName: data.positionName,
        jobSummary: data.jobSummary,
        department: data.department
      };
      if (!editing.id) {
        await addPosition(positionDetails);
        const updatedPositions = await fetchPositions();
        setPositions(updatedPositions);
        setIsFormOpen(false);
        setEditing({});
      } else {
        await editPosition(editing.id, positionDetails);
        const updatedPositions = await fetchPositions();
        setPositions(updatedPositions);
        setIsFormOpen(false);
        setEditing({});
      }
    } catch (error) {
      console.error('Failed to add or update position:', error);
    }
  }


  useEffect(() => {
    const fetchInitialData = async () => {
      const initialPositions = await fetchPositions();
      setPositions(initialPositions);
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
    setEditing({
      ...row,
      department: row.department.id,
    });
    setIsFormOpen(true);
  };


  const positionColumns = [
    { field: 'order', headerName: 'STT', flex: 0.5, },
    { field: 'positionName', headerName: 'CHỨC VỤ', flex: 1.5, },
    { field: 'jobSummary', headerName: 'TÓM TẮT', flex: 2.5, },
    { field: 'employeeCount', headerName: 'SỐ NV', flex: 1 },
    {
      field: 'departmentName', headerName: 'BỘ PHẬN', flex: 1.5,
      valueGetter: (params) => params.row.department.departmentName
    },
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
    <HelmetProvider>
      <div className='positions' style={{ width: '70vw' }}>
        <ToastContainer />
        <Helmet>
          <title>Quản lý chức vụ</title>
        </Helmet>
        <div className='info'>
          <button onClick={openForm} className='btn-add'>+ Thêm</button>
        </div>

        <DataTable columns={positionColumns} data={positions} slug="position" showEditColumn={false} />;
        {isFormOpen && (
          <div className="overlay" onClick={closeForm}>
            <FormComponent fields={addPositionColumns} onSubmit={handleFormSubmit} onCancel={closeForm} initialValues={editing} />
          </div>
        )}
        <ConfirmDeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={closeDeleteModal} />
      </div>
    </HelmetProvider>


  );
}

export default Position
