import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import EmployeeForm from './EmployeeForm'; 
import DataTable from '../../components/dataTable/DataTable';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [mode, setMode] = useState('add');
    const [showEditTab, setShowEditTab] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);  

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8080/employees/getAllEmployees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditEmployee = (employee) => {
      setEditingEmployee(employee); // Cập nhật biến trạng thái với dữ liệu của nhân viên
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
        { field: 'positionName', headerName: 'CHỨC VỤ', flex: 1 },
        { field: 'departmentName', headerName: 'PHÒNG BAN', flex: 1 },
        { field: 'phoneNumber', headerName: 'PHONE NUMBER', flex: 1.7 },
        {
            field: 'edit',
            headerName: 'Edit',
            renderCell: (params) => (
                <button onClick={() => handleEditEmployee(params.row)}>Edit</button>
            ),
            flex: 0.6,
        },
    ];

    const getImageUrl = (image) => {
        return `http://localhost:8080/api/FileUpload/files/${image}`;
    };

    // index là tab muốn chuyển sang
    const handleTabSelect = (index) => {
      if ((tabIndex === 2 || tabIndex === 1) && index === 0) {
        const confirmLeave = window.confirm('Bạn có chắc chắn muốn rời đi mà không lưu?');
        if (!confirmLeave) {
          return;
        }
      }
  
      setTabIndex(index);
  
      if (index === 1 || index == 0) {
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
                <DataTable columns={tableColumns} data={employees} />
            </TabPanel>
            <TabPanel>
        {mode === 'add' && <EmployeeForm mode={mode} />}
      </TabPanel>
      <TabPanel>
        {mode === 'edit' && editingEmployee && <EmployeeForm mode={mode} currentEmployee={editingEmployee} />} 
      </TabPanel>

        </Tabs>
    );
};

export default Employee;
