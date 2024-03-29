import DataTable from '../../components/dataTable/DataTable.jsx'
import './employee.css'
import { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm.jsx';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [mode, setMode] = useState('add');  
  const [showEditTab, setShowEditTab] = useState(false);  

  const [file, setFile] = useState(null);
  const getImageUrl = (image) => {

    return `http://localhost:8080/api/FileUpload/files/${image}`;

  }
  const tableColumns = [
    {
      field: 'image',
      headerName: 'Avatar',
      renderCell: (params) => (
        <img src={getImageUrl(params.row.image)} alt="Avatar" style={{ width: '40px', height: '40px' }} />
      ),
      flex: 0.6,
    },
    { field: 'employeeCode', headerName: 'MÃ NHÂN VIÊN', flex: 1, },
    { field: 'fullName', headerName: 'TÊN NHÂN VIÊN', flex: 1.4, },
    {field: 'positionName', headerName: 'CHỨC VỤ', flex: 1,},
    {field: 'departmentName', headerName: 'PHÒNG BAN', flex: 1,},

    // {
    //   field: 'position', headerName: 'CHỨC VỤ', flex: 1,
    //   renderCell: (params) => (<span>{params.row.position?.positionName}</span>),
    // },
    // {
    //   field: 'department', headerName: 'PHÒNG BAN', flex: 1,
    //   renderCell: (params) => (<span>{params.row.department?.departmentName}</span>),
    // },
    { field: 'phoneNumber', headerName: 'PHONE NUMBER', flex: 1.7 },
  ];

  async function fetchPositions() {
    const response = await fetch('http://localhost:8080/positions/getAllPositions');
    const data = await response.json();
    return data;
  }

  async function fetchDepartments() {
    const response = await fetch('http://localhost:8080/departments/getAllDepartments');
    const data = await response.json();
    return data;
  }

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    if (name in employee) {
      setEmployee(prevEmployee => ({ ...prevEmployee, [name]: value }));
    } else  {
      setEmployee(prevEmployee => ({ 
        ...prevEmployee, 
        personalInfo: { ...prevEmployee.personalInfo, [name]: value }
      }));
    } 
  }  

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name in employee) {
      setCurrentEmployee(prevEmployee => ({ ...prevEmployee, [name]: value }));
      setEmployee(prevEmployee => ({ ...prevEmployee, [name]: value }));
    } else  {
      setCurrentEmployee(prevEmployee => ({ 
        ...prevEmployee, 
        personalInfo: { ...prevEmployee.personalInfo, [name]: value }
      }));
      setEmployee(prevEmployee => ({ 
        ...prevEmployee, 
        personalInfo: { ...prevEmployee.personalInfo, [name]: value }
      }));
    } 
  }  
   
  const handleImageChange = (imageUrl) => {
    setEmployee(prevEmployee => ({ ...prevEmployee, image: imageUrl }));
  };
  const [employee, setEmployee] = useState({
    fullName: '',
    phoneNumber: '',
    workEmail: '',
    positionName: '',
    departmentName: '',
    nameContactER: '',
    phoneContactER: '',
    personalInfo: {
      nationality: '',
      birthPlace: '',
      isResident: true,
      sex: '',
      birthDate: '',
      identityCardNumber: '',
      // certificates: [],
      // personalAddress: '',
      personalEmail: '',
      certificateLevel: '',
      fieldOfStudy: '',
      school: ''
    },

  });
  
  const handleUpdate = async (e) => {
    const updatedPersonalInfo = {
      nationality: currentEmployee.personalInfo.nationality,
      birthPlace: currentEmployee.personalInfo.birthPlace,
      isResident: currentEmployee.personalInfo.isResident,
      sex: currentEmployee.personalInfo.sex,
      birthDate: currentEmployee.personalInfo.birthDate,
      identityCardNumber: currentEmployee.personalInfo.identityCardNumber,
      personalEmail: currentEmployee.personalInfo.personalEmail,
      fieldOfStudy: currentEmployee.personalInfo.fieldOfStudy,
      school: currentEmployee.personalInfo.school,
    };
    const updatedEmployee = {
      fullName: currentEmployee.fullName,
      phoneNumber: currentEmployee.phoneNumber,
      workEmail: currentEmployee.workEmail,
      positionName: currentEmployee.positionName,
      departmentName: currentEmployee.departmentName,
      nameContactER: currentEmployee.nameContactER,
      phoneContactER: currentEmployee.phoneContactER,
      personalInfo: updatedPersonalInfo,
    };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('employee', JSON.stringify(updatedEmployee));
    console.log('File:', file);
    console.log('Employee:', updatedEmployee);
    
    try {
      const updateEmployeeResponse = await fetch(`http://localhost:8080/employees/updateEmployee/${currentEmployee.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (updateEmployeeResponse.ok) {
        const updateEmployeeResult = await updateEmployeeResponse.json();
        console.log(updateEmployeeResult);
        // console.log(data)
        setMode('add');
        setCurrentEmployee(null);
      } else {
        console.error('Server response was not ok.');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };
  
  

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialEmployees = await fetchEmployees();
      const transformedEmployees = initialEmployees ? initialEmployees.map(employee => ({
        ...employee,
        positionName: employee.position?.positionName,
      })) : [];
      const initialPositions = await fetchPositions();
      setPositions(initialPositions);
      const initialDepartments = await fetchDepartments();
      setDepartments(initialDepartments);
    }
    fetchInitialData();
  }, []);

  const handleSubmitForm = async (e) => {

    if (!employee.fullName.trim()) {
      alert('Trường họ tên không được để trống');
      return;
    }

    if (!/^(0|\+84)\d{9}$/.test(employee.phoneNumber)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }
  
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(employee.workEmail)) {
      alert('Email công việc không hợp lệ');
      return;
    }

    if (!/^\d{12}$/.test(employee.personalInfo.identityCardNumber)) {
      alert('Số CCCD phải có 12 số');
      return;
    }
  
    const response = await fetch('http://localhost:8080/employees/exists/${employee.personalInfo.identityCardNumber}');
    const exists = await response.json();
    if (exists) {
      alert('Nhân viên đã tồn tại');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('employee', JSON.stringify(employee));
    console.log(file);
    console.log(employee)
    try {
      const addEmployeeResponse = await fetch('http://localhost:8080/employees/addEmployee', {
        method: 'POST',
        body: formData,
      });
      if (addEmployeeResponse.ok) {
        const addEmployeeResult = await addEmployeeResponse.json();
        setEmployees([...employees, addEmployeeResult]); // Update the list of employees
        setTabIndex(0);
      } else {
        console.error('Server response was not ok.');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

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
  const handleEdit = (employee) => {
    setCurrentEmployee(JSON.parse(JSON.stringify(employee)));
    setMode('edit');
    setTabIndex(2);
    setShowEditTab(true);
};

  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>+ Thêm</Tab>
        {showEditTab && (
            <Tab className={`tab-item ${tabIndex === 2 ? 'active' : ''}`} style={{ color: tabIndex === 2 ? '#5a5279' : 'gray' }}>Sửa</Tab>
        )}
      </TabList>
      <TabPanel>
        <DataTable columns={tableColumns} data={employees} slug="employee" onEdit={handleEdit} showEditColumn={true}/>
      </TabPanel>
      <TabPanel>
        <EmployeeForm
        handleInput={handleAddInputChange}
        handleSubmit={handleSubmitForm}
        fileName={file}
        setFileName={setFile}
        employee={employee}/>
    
      </TabPanel>
      {tabIndex === 2 && (
    <TabPanel>
        <EmployeeForm
            handleInput={handleEditInputChange}
            handleSubmit={handleUpdate}
            fileName={file}
            setFileName={setFile}
            employee={currentEmployee}/>
    </TabPanel>
      )}

    </Tabs>
  );
};


export default Employee


