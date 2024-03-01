import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState, useEffect } from 'react';

const EmployeeForm = ({employee, handleSubmit, handleInput, fileName, setFileName}) => {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/placeholder.png');
  const [provinces, setProvinces] = useState([]);
  const [tabIndex2, setTabIndex2] = useState(0);
  const [image, setUrlImage] = useState(null);
  const [employees, setEmployees] = useState([]);  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(employee, fileName);
  };
      
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
  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100');
      const data = await response.json();
      const provinceNames = data.results.map(province => province.name);
      setProvinces(provinceNames);
    }
    fetchProvinces();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0]);
      setBackgroundImage(URL.createObjectURL(e.target.files[0]));
      setShowDeleteIcon(true);
    }
  };
  const handleDelete = () => {
    setUrlImage(null);
    setBackgroundImage('/placeholder.png');
    setShowDeleteIcon(false);
  };
  return (
    <form onSubmit={handleFormSubmit}>
    <button type="submit" className='btn-add'>Lưu</button>
    <Tabs>
      <TabPanel>
      <div className='employee-info' style={{display: "flex", flexWrap: 'wrap' }}>
      <div className=""  style={{ flex: '2 0 50%', padding: '10px' }}>
        <input type="text" name="fullName" value={employee?.fullName ?? ''} onChange={handleInput} placeholder="Full Name" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90%', margin: '20px 0px' }} />
        <select name="positionName" value={employee?.positionName ?? ''} onChange={handleInput} className='form-control select' >
          <option value=''>Chọn chức vụ ...</option>
          {positions.map((position, index) => (
            <option key={index} value={position.positionName}>
              {position.positionName}
            </option>
          ))}
        </select>
        <select name="departmentName" value={employee?.departmentName ?? ''} onChange={handleInput} className='form-control select'>
          <option value=''>Chọn bộ phận ...</option>
          {departments.map((department, index) => (
            <option key={index} value={department.departmentName}>
              {department.departmentName}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: '20px', width: '93%'}}>
          <input type="text" name="phoneNumber" value={employee?.phoneNumber ?? ''} onChange={handleInput} placeholder="Phone Number" className='form-control more' />
          <input type="text" name="workEmail" value={employee?.workEmail ?? ''} onChange={handleInput} placeholder="Work Email" className='form-control more' />
        </div>
        </div>
        <div className="empl-avt" style={{flex: '1', position: 'relative', marginTop: '45px'}}>
          <input type="file" id="fileInput" onChange={handleFileChange} style={{display: 'none'}}/>
          <label htmlFor="fileInput">
            <img src={backgroundImage} alt="Your alt text" style={{border: '1px #ccc solid'}}/>
          </label>
          {showDeleteIcon && (
            <img src='/delete.svg' className='delete-icon' alt="Delete" style={{position: 'absolute', left: 80, bottom: 50, cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', color: '#000', backgroundColor: '#ccc', padding:'5px'}} onClick={handleDelete} />
          )}
        </div>
        </div>
      </TabPanel>
      <Tabs style={{ backgroundColor: '#fff' }}>
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
            <div className="form-grid grid-item">
              <label>LIÊN HỆ CÁ NHÂN</label>
              <div className="item-info">
                <label htmlFor="personalEmail">Email</label>
                <input type="text" name="personalEmail" value={employee?.personalInfo?.personalEmail ?? ''} onChange={handleInput} />
              </div>
            </div>
            <div className="form-grid grid-item">
              <label>LIÊN HỆ KHẨN CẤP</label>
              <div className="item-info">
                <label htmlFor="nameContactER">Tên liên hệ</label>
                <input type="text" name="nameContactER" value={employee?.nameContactER ?? ''} onChange={handleInput} />
              </div>
              <div className="item-info">
                <label htmlFor="phoneContactER">Số điện thoại</label>
                <input type="text" name="phoneContactER" value={employee?.phoneContactER ?? ''} onChange={handleInput} />
              </div>
            </div>
            <div className="form-grid grid-item">
              <label>CÔNG DÂN</label>
              <div className="item-info">
                <label htmlFor='nationality'>Quốc tịch</label>
                <input type="text" name="nationality" value={employee?.personalInfo?.nationality ?? ''} onChange={handleInput} className='f' />
              </div>
              <div className="item-info">
                <label htmlFor='birthPlace'>Nơi sinh</label>
                <select name="birthPlace" value={employee?.personalInfo?.birthPlace ?? ''} onChange={handleInput}>
                  <option value="">Chọn tỉnh ...</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div className="item-info">
                <label htmlFor="sex">Giới tính</label>
                <select name="sex" value={employee?.personalInfo?.sex ?? ''} onChange={handleInput}>
                  <option value="">Chọn giới tính...</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="item-info">
                <label htmlFor="birthDate">Ngày sinh</label>
                <input type="date" name="birthDate" value={employee?.personalInfo?.birthDate ?? ''} onChange={handleInput} />
              </div>
              <div className="item-info">
                <label htmlFor="identityCardNumber">Số CCCD</label>
                <input type="text" name="identityCardNumber" value={employee?.personalInfo?.identityCardNumber ?? ''} onChange={handleInput} />
              </div>
            </div>
            <div className="form-grid grid-item">
              <label>GIÁO DỤC</label>
              <div className="item-info">
                <label htmlFor="certificateLevel">Cấp bằng</label>
                <select name="certificateLevel" value={employee?.personalInfo?.certificateLevel ?? ''} onChange={handleInput}>
                  <option value="">Chọn cấp...</option>
                  <option value="Tốt nghiệp">Tốt nghiệp</option>
                  <option value="Cử nhân">Cử nhân</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="item-info">
                <label htmlFor="fieldOfStudy">Chuyên ngành</label>
                <input type="text" name="fieldOfStudy" value={employee?.personalInfo?.fieldOfStudy ?? ''} onChange={handleInput} />
              </div>
              <div className="item-info">
                <label htmlFor="school">Trường học</label>
                <input type="text" name="school" value={employee?.personalInfo?.school ?? ''} onChange={handleInput} />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          Tttt
        </TabPanel>
      </Tabs>
    </Tabs>
  </form>

  )
}

export default EmployeeForm



// import React from 'react'
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import { useState, useEffect } from 'react';

// const EmployeeForm = ({employee, handleSubmit, handleInput, fileName, setFileName, handleImageChange}) => {
//   const [positions, setPositions] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [showDeleteIcon, setShowDeleteIcon] = useState(false);
//   const [backgroundImage, setBackgroundImage] = useState('/placeholder.png');
//   const [provinces, setProvinces] = useState([]);
//   const [tabIndex2, setTabIndex2] = useState(0);
//   const [image, setUrlImage] = useState(null);
//   const [employees, setEmployees] = useState([]);  
//   // const [employee, setEmployee] = useState(employeeT);
  
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     handleSubmit(employee, fileName);
//   };


//   async function fetchPositions() {
//     const response = await fetch('http://localhost:8080/positions/getAllPositions');
//     const data = await response.json();
//     return data;
//   }

//   async function fetchDepartments() {
//     const response = await fetch('http://localhost:8080/departments/getAllDepartments');
//     const data = await response.json();
//     return data;
//   }
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const initialEmployees = await fetchEmployees();
//       const transformedEmployees = initialEmployees ? initialEmployees.map(employee => ({
//         ...employee,
//         positionName: employee.position?.positionName,
//       })) : [];
//       const initialPositions = await fetchPositions();
//       setPositions(initialPositions);
//       const initialDepartments = await fetchDepartments();
//       setDepartments(initialDepartments);
//     }
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/employees/getAllEmployees');
//       const data = await response.json();
//       setEmployees(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
//   useEffect(() => {
//     const fetchProvinces = async () => {
//       const response = await fetch('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100');
//       const data = await response.json();
//       const provinceNames = data.results.map(province => province.name);
//       setProvinces(provinceNames);
//     }
//     fetchProvinces();
//   }, []);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const imageUrl = URL.createObjectURL(e.target.files[0]);
//       setBackgroundImage(imageUrl);
//       setShowDeleteIcon(true);
//       handleImageChange(imageUrl); // Gọi hàm được truyền từ component cha
//     }
//   };
//   const handleDelete = () => {
//     setUrlImage(null);
//     setBackgroundImage('/placeholder.png');
//     setShowDeleteIcon(false);
//   };
//   return (
  //   <form onSubmit={handleFormSubmit}>
  //   <button type="submit" className='btn-add'>Lưu</button>
  //   <Tabs>
  //     <TabPanel>
  //     <div className='employee-info' style={{display: "flex", flexWrap: 'wrap' }}>
  //     <div className=""  style={{ flex: '2 0 50%', padding: '10px' }}>
  //       <input type="text" name="fullName" value={employee?.fullName ?? ''} onChange={handleInput} placeholder="Full Name" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90%', margin: '20px 0px' }} />
  //       <select name="positionName" value={employee?.positionName ?? ''} onChange={handleInput} className='form-control select' >
  //         <option value=''>Chọn chức vụ ...</option>
  //         {positions.map((position, index) => (
  //           <option key={index} value={position.positionName}>
  //             {position.positionName}
  //           </option>
  //         ))}
  //       </select>
  //       <select name="departmentName" value={employee?.departmentName ?? ''} onChange={handleInput} className='form-control select'>
  //         <option value=''>Chọn bộ phận ...</option>
  //         {departments.map((department, index) => (
  //           <option key={index} value={department.departmentName}>
  //             {department.departmentName}
  //           </option>
  //         ))}
  //       </select>
  //       <div style={{ display: "flex", gap: '20px', width: '93%'}}>
  //         <input type="text" name="phoneNumber" value={employee?.phoneNumber ?? ''} onChange={handleInput} placeholder="Phone Number" className='form-control more' />
  //         <input type="text" name="workEmail" value={employee?.workEmail ?? ''} onChange={handleInput} placeholder="Work Email" className='form-control more' />
  //       </div>
  //       </div>
  //       <div className="empl-avt" style={{flex: '1', position: 'relative', marginTop: '45px'}}>
  //         <input type="file" id="fileInput" onChange={handleFileChange} style={{display: 'none'}}/>
  //         <label htmlFor="fileInput">
  //           <img src={backgroundImage} alt="Your alt text" style={{border: '1px #ccc solid'}}/>
  //         </label>
  //         {showDeleteIcon && (
  //           <img src='/delete.svg' className='delete-icon' alt="Delete" style={{position: 'absolute', left: 80, bottom: 50, cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', color: '#000', backgroundColor: '#ccc', padding:'5px'}} onClick={handleDelete} />
  //         )}
  //       </div>
  //       </div>
  //     </TabPanel>
  //     <Tabs style={{ backgroundColor: '#fff' }}>
  //       <TabList className="tablist2">
  //         <Tab className={`tab-item ${tabIndex2 === 0 ? 'active' : ''}`} onClick={() => setTabIndex2(0)}>Tiếp tục</Tab>
  //         <Tab className={`tab-item ${tabIndex2 === 1 ? 'active' : ''}`} onClick={() => setTabIndex2(1)}>Thông tin công việc</Tab>
  //         <Tab className={`tab-item ${tabIndex2 === 2 ? 'active' : ''}`} onClick={() => setTabIndex2(2)}>Thông tin riêng tư</Tab>
  //         <Tab className={`tab-item ${tabIndex2 === 3 ? 'active' : ''}`} onClick={() => setTabIndex2(3)}>Thiết lập nhân lực</Tab>
  //       </TabList>
  //       <TabPanel>
  //         Tiếp tục
  //       </TabPanel>
  //       <TabPanel>
  //         Thông tin công việc
  //       </TabPanel>
  //       <TabPanel>
  //         <div className='container-grid'>
  //           <div className="form-grid grid-item">
  //             <label>LIÊN HỆ CÁ NHÂN</label>
  //             <div className="item-info">
  //               <label htmlFor="personalEmail">Email</label>
  //               <input type="text" name="personalEmail" value={employee?.personalInfo?.personalEmail ?? ''} onChange={handleInput} />
  //             </div>
  //           </div>
  //           <div className="form-grid grid-item">
  //             <label>LIÊN HỆ KHẨN CẤP</label>
  //             <div className="item-info">
  //               <label htmlFor="nameContactER">Tên liên hệ</label>
  //               <input type="text" name="nameContactER" value={employee?.nameContactER ?? ''} onChange={handleInput} />
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor="phoneContactER">Số điện thoại</label>
  //               <input type="text" name="phoneContactER" value={employee?.phoneContactER ?? ''} onChange={handleInput} />
  //             </div>
  //           </div>
  //           <div className="form-grid grid-item">
  //             <label>CÔNG DÂN</label>
  //             <div className="item-info">
  //               <label htmlFor='nationality'>Quốc tịch</label>
  //               <input type="text" name="nationality" value={employee?.personalInfo?.nationality ?? ''} onChange={handleInput} className='f' />
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor='birthPlace'>Nơi sinh</label>
  //               <select name="birthPlace" value={employee?.personalInfo?.birthPlace ?? ''} onChange={handleInput}>
  //                 <option value="">Chọn tỉnh ...</option>
  //                 {provinces.map((province, index) => (
  //                   <option key={index} value={province}>
  //                     {province}
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor="sex">Giới tính</label>
  //               <select name="sex" value={employee?.personalInfo?.sex ?? ''} onChange={handleInput}>
  //                 <option value="">Chọn giới tính...</option>
  //                 <option value="Nam">Nam</option>
  //                 <option value="Nữ">Nữ</option>
  //                 <option value="Khác">Khác</option>
  //               </select>
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor="birthDate">Ngày sinh</label>
  //               <input type="date" name="birthDate" value={employee?.personalInfo?.birthDate ?? ''} onChange={handleInput} />
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor="identityCardNumber">Số CCCD</label>
  //               <input type="text" name="identityCardNumber" value={employee?.personalInfo?.identityCardNumber ?? ''} onChange={handleInput} />
  //             </div>
  //           </div>
  //           <div className="form-grid grid-item">
  //             <label>GIÁO DỤC</label>
  //             <div className="item-info">
  //               <label htmlFor="certificateLevel">Cấp bằng</label>
  //               <select name="certificateLevel" value={employee?.personalInfo?.certificateLevel ?? ''} onChange={handleInput}>
  //                 <option value="">Chọn cấp...</option>
  //                 <option value="Tốt nghiệp">Tốt nghiệp</option>
  //                 <option value="Cử nhân">Cử nhân</option>
  //                 <option value="Thạc sĩ">Thạc sĩ</option>
  //                 <option value="Tiến sĩ">Tiến sĩ</option>
  //                 <option value="Khác">Khác</option>
  //               </select>
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor="fieldOfStudy">Chuyên ngành</label>
  //               <input type="text" name="fieldOfStudy" value={employee?.personalInfo?.fieldOfStudy ?? ''} onChange={handleInput} />
  //             </div>
  //             <div className="item-info">
  //               <label htmlFor="school">Trường học</label>
  //               <input type="text" name="school" value={employee?.personalInfo?.school ?? ''} onChange={handleInput} />
  //             </div>
  //           </div>
  //         </div>
  //       </TabPanel>
  //       <TabPanel>
  //         Tttt
  //       </TabPanel>
  //     </Tabs>
  //   </Tabs>
  // </form>
//   )
// }

// export default EmployeeForm