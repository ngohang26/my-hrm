import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import './employee.css'
import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FormGrid from '../../components/Form/FormGird.jsx';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const Employee = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [urlImage, setUrlImage] = useState(null);
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [data, setData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const tableColumns = [
    {
      field: 'urlImage',
      headerName: 'Avatar',
      renderCell: (params) => (
        <img src={params.value} alt="Avatar" style={{ width: '40px', height: '40px' }} />
      ),
      flex: 1,
    },
    {field: 'employeeCode', headerName: 'MÃ NHÂN VIÊN', flex: 1,},
    {
      field: 'position', headerName: 'CHỨC VỤ', flex: 2,
      renderCell: (params) => (<span>{params.row.position?.positionName}</span>),
    },
    {
      field: 'department', headerName: 'PHÒNG BAN', flex: 2,
      renderCell: (params) => (<span>{params.row.department?.departmentName}</span>),
    },
    {field: 'departmentName', headerName: 'PHÒNG BAN', flex: 2.5,},
    {field: 'phoneNumber', headerName: 'PHONE NUMBER', flex: 1.7},
  ];
  
  const employeeColumns = [
    {
      field: 'urlImage',
      headerName: 'Avatar',
      renderCell: (params) => (
        <img src={params.value} alt="Avatar" style={{ width: '40px', height: '40px' }} />
      ), flex: 1,
    },
    {field: 'fullName', headerName: 'FULL NAME'},
    {field: 'positionName', headerName: 'CHỨC VỤ'},
    {field: 'departmentName', headerName: 'PHÒNG BAN',},
    {field: 'phoneNumber', headerName: 'PHONE NUMBER'},
    {filed: 'workEmail', headerName: 'EMAIL CÔNG VIỆC'}
  ];
  
  const personalInfoColumns = [
    {field: 'nationality', headerName: 'Quốc tịch', type: 'string'},
    {field: 'birthPlace', headerName: 'Nơi sinh', type: 'select', options: provinces},
    // {field: 'residence', headerName: '', type: 'string'},
    {field: 'birthDate', headerName: 'Ngày sinh', type: 'date'},
    {field: 'identityCardNumber', headerName: 'Số CMND', type: 'string'},
  ] 
  
  const educationColumns = [
    {field: 'certificateLevel', headerName: 'Cấp chứng chỉ', type: 'string'},
    {field: 'fieldOfStudy', headerName: 'Chuyên ngành', type: 'string'},
    {field: 'school', headerName: 'Trường học', type: 'string'},
  ]
  
  const emergencyContactColumns = [
    {field:'nameContactER', headerName: 'Tên liên hệ', type: 'string'},
    {field:'phoneContactER', headerName: 'Số điện thoại', type: 'string'},
  ]
  
  async function fetchEmployees() {
    const response = await fetch('http://localhost:8080/employees/getAllEmployees');
    return await response.json();
  }
  
  async function fetchPositions() {
    const response = await fetch('http://localhost:8080/positions/getAllPositions');
    const data = await response.json();
    console.log('Positions:', data);
    return data;
  }
  
  async function fetchDepartments() {
    const response = await fetch('http://localhost:8080/departments/getAllDepartments');
    const data =  await response.json();
    return data;
  }
  
  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };
  const handleFormSubmit = (data) => {
    console.log(data);
    setIsFormOpen(false);
  }
  const openForm = () => {setIsFormOpen(true);}
  const closeForm = (event) => {
    if (event.target === event.currentTarget) {setIsFormOpen(false);}
  }

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };
  
  useEffect(() => {
    const fetchInitialData = async () => {
      const initialEmployees = await fetchEmployees();
      const transformedEmployees = initialEmployees.map(employee => ({
        ...employee,
        positionName: employee.position?.positionName,
      }));
      setEmployees(transformedEmployees);
      const initialPositions = await fetchPositions();
      setPositions(initialPositions);
      const initialDepartments = await fetchDepartments();
      setDepartments(initialDepartments);
    }
    fetchInitialData();
  }, []);

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

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100'); 
      const data = await response.json();
      const provinceNames = data.results.map(province => province.name);
      setProvinces(provinceNames);
    }
    fetchProvinces();
  }, []);
  

  const [tabIndex, setTabIndex] = useState(0);
  const [tabIndex2, setTabIndex2] = useState(0);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/placeholder.png');
  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUrlImage(event.target.files[0]);
      setBackgroundImage(URL.createObjectURL(event.target.files[0]));
      setShowDeleteIcon(true);
    }
  };
  
  const handleDelete = () => {
    setUrlImage(null);
    setBackgroundImage('/placeholder.png');
    setShowDeleteIcon(false);
  };
  
  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>+ Thêm</Tab>      
      </TabList>
      <TabPanel>
        <DataTable columns={tableColumns} data={employees} slug="employee" />;
      </TabPanel>
      <TabPanel>
        <Tabs>
          <TabPanel>
            <div className='employee-info' style={{display: "flex", flexWrap: 'wrap' }}>
              <div className=""  style={{ flex: '9 0 50%', padding: '10px' }}>
                {employeeColumns && employeeColumns.filter((item) => item.field !== "urlImage").map((column, index) => (
                  column.field === 'positionName' ? (
                    <FormControl style={{width: '45%', backgroundColor: "#fff", marginRight: "24px"}}  >
                      <InputLabel id="position-label">Chức vụ</InputLabel>
                      <Select
                        labelId="position-label"
                        id="position"
                        value={position}
                        onChange={handlePositionChange}
                        label="Chức vụ"
                      >
                        {positions.map((pos) => (
                          <MenuItem key={pos.id} value={pos.positionName}>
                            {pos.positionName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : column.field === 'departmentName' ? (
                    <FormControl style={{width: '45%', backgroundColor: "#fff"}}>
                      <InputLabel id='department-label'>Phòng ban</InputLabel>
                      <Select
                        labelId="department-label"
                        id="department"
                        value={department}
                        onChange={handleDepartmentChange}
                        label="Phòng ban"
                      >
                        {departments.map((dep) => (
                          <MenuItem key={dep.id} value={dep.departmentName}>
                            {dep.departmentName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : column.field === 'fullName' ? (
                    <input type={column.type} placeholder={column.headerName} onChange={handleInputChange} className='form-control' style={{height: '50px', fontSize: '26px', fontWeight: "600", width: '90%', margin: '20px 0px'}}/>
                  ) : null
                ))}
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: '93%'}}>
                  {employeeColumns.filter((item) => item.field !== "urlImage" && item.field !== 'positionName' && item.field !== 'fullName' && item.field !== 'departmentName').map((column, index) => (
                    <input type={column.type} placeholder={column.headerName} onChange={handleInputChange} className='form-control more'/>
                  ))}
                </div>
              </div>

              <div className="empl-avt" style={{flex: '1', position: 'relative'}}>
                <input type="file" id="fileInput" onChange={handleAvatarChange} style={{display: 'none'}}/>
                <label for="fileInput">
                  <img src={backgroundImage} alt="Your alt text" />
                </label>
                {showDeleteIcon && (
                  <img src='/delete.svg' className='delete-icon' alt="Delete" style={{position: 'absolute', right: 0, bottom: 140, cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', color: '#000', backgroundColor: '#ccc', padding:'5px'}} onClick={handleDelete} />
                )}
              </div>
            </div>
          </TabPanel>
          <Tabs className='tabs-more'>
          <TabList className="tablist2">
            <Tab className={`tab-item ${tabIndex2 === 0 ? 'active' : ''}`} onClick={() => setTabIndex2(0)}>Tiếp tục</Tab>
            <Tab className={`tab-item ${tabIndex2 === 1 ? 'active' : ''}`} onClick={() => setTabIndex2(1)}>Thông tin công việc</Tab>
            <Tab className={`tab-item ${tabIndex2 === 2 ? 'active' : ''}`} onClick={() => setTabIndex2(2)}>Thông tin riêng tư</Tab>
            <Tab className={`tab-item ${tabIndex2 === 3 ? 'active' : ''}`} onClick={() => setTabIndex2(3)}>Thiết lập nhân lực</Tab>
          </TabList>
            <TabPanel>
              Tiếp tục
            </TabPanel>
            <TabPanel>
              Thông tin công việc 
            </TabPanel>
            <TabPanel>
              <div className='container-grid'>
                <div className='grid-item'>
                  <label>CÔNG DÂN</label>
                  <FormGrid fields= {personalInfoColumns}/>
                </div>
                <div className='grid-item'>
                  <label>CÔNG DÂN</label>
                  <FormGrid fields= {personalInfoColumns}/>
                </div>
                <div className='grid-item'>
                  <label>LIÊN HỆ KHẨN CẤP</label>
                  <FormGrid fields = {emergencyContactColumns}/>
                </div>
                <div className='grid-item'>
                  <label>GIÁO DỤC</label>
                  <FormGrid fields = {educationColumns}/>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              Thông tin công việc2 
            </TabPanel>
          </Tabs>
        </Tabs>
      </TabPanel>
    </Tabs>
  );
}

export default Employee



    // <div className='users'>
    //   <div className='info'>
    //     <h3>Employee list</h3>
    //     {/* <button onClick={() => setOpen(true)}>Add New User</button> */}
    //   </div>
    //   <DataTable columns={employeeColumns} fetchData={fetchUsers} slug="employee" />;
    //   {/* {open && <Add columns={employeeColumns} setOpen={setOpen} />} */}
    //   {/* <button onClick={openForm} className='btn-add'>Thêm</button> */}

    //   {isFormOpen && (
    //     <div className="overlay" onClick={closeForm}>
    //       <FormComponent fields={employeeColumns} onSubmit={handleFormSubmit} />
    //     </div>
    //   )}  
    // </div>