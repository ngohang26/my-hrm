import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import './department.css'
import { useState, useEffect } from 'react';
import FormComponent from '../../components/Add/FormComponent.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Position from '../positions/Position.jsx';

const departmentColumns = [
  {
    field: 'departmentName',
    headerName: 'TÊN BỘ PHẬN',
    flex: 2.5,
  },
  {
    field: 'managerCode',
    headerName: 'MNV TRƯỞNG BỘ PHẬN',
    flex: 2.5,
  }
];



async function fetchDepartments() {
  const response = await fetch('http://localhost:8080/departments/getAllDepartments');
  const departments = await response.json();
  return departments.map(department => ({
    ...department,
    managerName: department.manager ? department.manager.fullName : '',
    managerCode: department.manager ? department.manager.employeeCode : '',
  }));
}

async function addDepartment(department, employeeCode) {
  const response = await fetch(`http://localhost:8080/departments/addDepartment?employeeCode=${employeeCode}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(department)
});

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const Department = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleFormSubmit = async (data) => {
    try {
      await addDepartment(data, data.managerCode);
      const updatedDepartments = await fetchDepartments();
      setDepartments(updatedDepartments);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to add department:', error);
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

  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Bộ phận</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>Chức vụ</Tab>      
      </TabList>

      <TabPanel>
        <div className='departments'>
        <div className='info'>
          <button onClick={openForm} className='btn-add'>+ Thêm</button>
        </div>
        <DataTable columns={departmentColumns} data={departments} slug="department" />;
        {isFormOpen && (
          <div className="overlay" onClick={closeForm}>
            <FormComponent fields={departmentColumns} onSubmit={handleFormSubmit} />
          </div>
        )}
        </div>
      </TabPanel>

      <TabPanel>
        <Position/>
      </TabPanel>
      </Tabs>

  );
}

export default Department
