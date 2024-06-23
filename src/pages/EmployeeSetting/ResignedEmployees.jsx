import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { apiUrl } from '../../config';
import { FaEye } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { EmployeeDetail } from '../employees/EmployeeDetail';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const ResignedEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const token = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(token);
  const employeeCode = decodedToken.username || '';
  const [showEditTab, setShowEditTab] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${apiUrl}/employees/getAllEmployeesTermination`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setTabIndex(1);
    setShowEditTab(true);
  };

  const tableColumns = [
    {
      field: 'image',
      headerName: 'AVATAR',
      renderCell: (params) => (
        <img src={getImageUrl(params.row.image)} alt="Avatar" style={{ width: '40px', height: '40px' }} />
      ),
      flex: 0.6,
    },
    { field: 'employeeCode', headerName: 'MÃ NHÂN VIÊN', flex: 1 },
    { field: 'fullName', headerName: 'TÊN NHÂN VIÊN', flex: 1.3 },
    {
      field: 'position',
      headerName: 'CHỨC VỤ',
      flex: 1.1,
      valueGetter: (params) => params.row.position.positionName,
    },
    {
      field: 'department',
      headerName: 'PHÒNG BAN',
      flex: 1,
      valueGetter: (params) => params.row.department.departmentName,
    },
    { field: 'phoneNumber', headerName: 'PHONE NUMBER', flex: 1 },
    {
      field: 'view',
      headerName: 'XEM',
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleViewEmployee(params.row)} className='btn-action'>
            <FaEye />
          </button>
        </div>
      ),
      flex: 0.8,
    },
  ];

  const getImageUrl = (image) => {
    return `${apiUrl}/api/FileUpload/files/images/${image}`;
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Danh sách nhân viên đã nghỉ việc</title>
      </Helmet>
      <Tabs selectedIndex={tabIndex} onSelect={index => {
        setTabIndex(index);
        if (index === 0) {
          setShowEditTab(false);
        }
      }}>
        <TabList className='tablist'>
          <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách đã nghỉ việc </Tab>
          {showEditTab && (

            <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>Chi tiết nhân viên</Tab>
          )}

        </TabList>

        <TabPanel>
          <DataTable columns={tableColumns} data={employees} />
        </TabPanel>
        {showEditTab && tabIndex === 1 && (
          <TabPanel>
            {selectedEmployee && (
              <EmployeeDetail employeeCode={selectedEmployee ? selectedEmployee.employeeCode : employeeCode} />
            )}
          </TabPanel>
        )}
      </Tabs>
    </HelmetProvider>
  );
};

export default ResignedEmployees;
