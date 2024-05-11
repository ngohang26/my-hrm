import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import EmployeeForm from './EmployeeForm'; 
import DataTable from '../../components/dataTable/DataTable';
import {apiUrl} from '../../config'

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [mode, setMode] = useState('add');
    const [showEditTab, setShowEditTab] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);  

    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]); 
  const [selectedPositionId, setSelectedPositionId] = useState();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState();
    
    useEffect(() => {
        fetchEmployees();
        fetchPositions(); 
        fetchDepartments();
    }, []);
    const token = localStorage.getItem('accessToken');


    const fetchEmployees = async () => {

        try {
            const response = await fetch(`${apiUrl}/employees/getAllEmployees`, {
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

    const fetchPositions = async () => {
        try {
            const response = await fetch(`${apiUrl}/positions/getAllPositions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
            const data = await response.json();
            setPositions(data);
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${apiUrl}/departments/getAllDepartments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleEditEmployee = (employee) => {
      setEditingEmployee(employee); // Cập nhật biến trạng thái với dữ liệu của nhân viên
    setSelectedPositionId(employee.position.id);
    setSelectedDepartmentId(employee.department.id);

      setMode('edit'); 
      setShowEditTab(true); 
      setTabIndex(2); 
  };
  const tableColumns = [
    {
        field: 'image',
        headerName: 'Avatar',
        renderCell: (params) => (
            <img src={getImageUrl(params.row.image)} alt="Avatar" style={{ width: '40px', height: '40px' }} />
        ),
        flex: 0.6,
    },
    { field: 'employeeCode', headerName: 'MÃ NHÂN VIÊN', flex: 1 },
    { field: 'fullName', headerName: 'TÊN NHÂN VIÊN', flex: 1.4 },
    { 
        field: 'position', 
        headerName: 'CHỨC VỤ', 
        flex: 1,
        valueGetter: (params) => params.row.position.positionName,
    },
    { 
        field: 'department', 
        headerName: 'PHÒNG BAN', 
        flex: 1,
        valueGetter: (params) => params.row.department.departmentName,
    },
    { field: 'phoneNumber', headerName: 'PHONE NUMBER', flex: 1.7 },
    {
        field: 'edit',
        headerName: 'Edit',
        renderCell: (params) => (
            <button onClick={() => handleEditEmployee(params.row)} className='btn-action'>Edit</button>
        ),
        flex: 0.6,
    },
];

    const getImageUrl = (image) => {
        return `${apiUrl}/api/FileUpload/files/images/${image}`;
    };

    // index là tab muốn chuyển sang
    const handleTabSelect = (index) => {
      if (((tabIndex === 2 || tabIndex === 1) && index === 0) || (tabIndex === 2 && index === 1)) {
        const confirmLeave = window.confirm('Bạn có chắc chắn muốn rời đi mà không lưu?');
        if (!confirmLeave) {
          return;
        }
      }
  
      setTabIndex(index);
  
      if (index === 1 || index === 0) {
        setEditingEmployee(null);
        setMode('add');
        setShowEditTab(false);  
      }
    };
  
  
    return (
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList className='tablist'>
            <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
            <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>+ Thêm</Tab>
            {showEditTab && (
              <Tab className={`tab-item ${tabIndex === 2 ? 'active' : ''}`} style={{ color: tabIndex === 2 ? '#5a5279' : 'gray' }}>Sửa</Tab>
            )}
          </TabList>
          <TabPanel>
            <DataTable columns={tableColumns} data={employees}/>
          </TabPanel>
          <TabPanel>
            {mode === 'add' && <EmployeeForm mode={mode}  
            setTabIndex={setTabIndex} 
            positions={positions} 
            departments={departments}
            fetchEmployees={fetchEmployees}
          selectedPositionId={selectedPositionId}
          selectedDepartmentId={selectedDepartmentId}
          setSelectedPositionId={setSelectedPositionId}
          setSelectedDepartmentId={setSelectedDepartmentId}
            />}
          </TabPanel>
          {showEditTab && (
            <TabPanel>
              {mode === 'edit' && editingEmployee && <EmployeeForm mode={mode} 
              currentEmployee={editingEmployee}  
              setTabIndex = {setTabIndex}
              setShowEditTab={setShowEditTab}
              positions={positions} 
              departments={departments}
              fetchEmployees={fetchEmployees}
            selectedPositionId={selectedPositionId}
            selectedDepartmentId={selectedDepartmentId}
            setSelectedPositionId={setSelectedPositionId}
            setSelectedDepartmentId={setSelectedDepartmentId}
              />} 
            </TabPanel>
          )}
        </Tabs>
      );
      
};

export default Employee;
