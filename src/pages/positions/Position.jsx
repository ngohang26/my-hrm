import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
// import './position.css'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Add/FormComponent.jsx';

const positionColumns = [
  {
    field: 'positionName',
    headerName: 'CHỨC VỤ',
    flex: 2.5,
  },
  {
    field: 'jobSummary',
    headerName: 'TÓM TẮT',
    flex: 2.5,
  }
];



async function fetchPositions() {
  const response = await fetch('http://localhost:8080/positions/getAllPositions');
  return await response.json();

}

async function addPosition(position) {
  const response = await fetch(`http://localhost:8080/positions/addPosition`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(position)
});

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const Position = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleFormSubmit = async (data) => {
    try {
      await addPosition(data);
      const updatedPositions = await fetchPositions();
      setPositions(updatedPositions);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to add position:', error);
    }
  }
  useEffect(() => {
    const fetchInitialData = async () => {
      const initialPositions = await fetchPositions();
      setPositions(initialPositions);
    }

    fetchInitialData();
  }, []);
  const openForm = () => {
    setIsFormOpen(true);
  }

  const closeForm = (event) => {
    if (event.target === event.currentTarget) {
      setIsFormOpen(false);
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
  const handleEdit = (id) => {
    // const employeeToEdit = data.find((employee) => employee.id === id);
    // setEditingEmployee(employeeToEdit);
};

  return (
        <div className='positions'>
        <div className='info'>
          <button onClick={openForm} className='btn-add'>+ Thêm</button>
        </div>
        <DataTable columns={positionColumns} data={positions} slug="position" onEdit={handleEdit} showEditColumn={true}/>;
        {isFormOpen && (
          <div className="overlay" onClick={closeForm}>
            <FormComponent fields={positionColumns} onSubmit={handleFormSubmit} />
          </div>
        )}
        </div>


  );
}

export default Position
