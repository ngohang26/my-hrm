import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';
export const EmployeeDetail = () => {
  const [provinces, setProvinces] = useState([]);
  const [tabIndex2, setTabIndex2] = useState(0);
    const getImageUrl = (image) => {
        return `http://localhost:8080/api/FileUpload/files/${image}`;
    };

  const [employeeData, setEmployeeData] = useState({
    fullName: '',
    phoneNumber: '',
    image: '',
    workEmail: '',
    positionName: '',
    departmentName: '',
    personalInfo: {
      nationality: '',
      birthPlace: '',
      isResident: true,
      sex: '',
      birthDate: '',
      identityCardNumber: '',
      personalEmail: '',
      fieldOfStudy: '',
      school: ''
    },
    skills: [],
    experiences: []
  })
  const [employeeCode, setEmployeeCode] = useState('');

  useEffect(() => {
      const token = localStorage.getItem('accessToken');
      const decodedToken = jwtDecode(token);
      setEmployeeCode(decodedToken.username || '');
  }, []);

  useEffect(() => {
      const fetchEmployeeData = async () => {
          try {
              const response = await fetch(`http://localhost:8080/employees/employee/${employeeCode}`, {
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                  }
              });

              if (!response.ok) {
                  throw new Error("Loi");
              }

              const data = await response.json();
              setEmployeeData(data);
          } catch (error) {
              console.error('loi', error);
          }
      };

      if (employeeCode) {
          fetchEmployeeData();
      }
  }, [employeeCode]);
  return (
    <>
      <ToastContainer />
      <Tabs>
        <div>
          <div className='employee-info' style={{ display: "flex", flexWrap: 'wrap' }}>
            <div className="" style={{ flex: '2 0 50%', padding: '10px' }}>
              <input type="text" name="fullName" id='fullName' value={employeeData.fullName} className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90.5%', margin: '20px 0px' }} readOnly />
              <div style={{ display: "flex", gap: '20px', width: '101%' }}>

                <select name="positionName" value={employeeData.positionName} className='form-control select' disabled>
                  <option value=''>{employeeData.positionName}</option>
                </select>

                <select name="departmentName" value={employeeData.departmentName} className='form-control select' disabled>
                  <option value=''>{employeeData.departmentName}</option>
                </select>

              </div>
              <div style={{ display: "flex", gap: '20px', width: '93%' }}>
                <input type="text" name="phoneNumber" value={employeeData.phoneNumber} className='form-control more' />
                <input type="text" name="workEmail" value={employeeData.workEmail} className='form-control more' />
              </div>
            </div>
            <label className='empl-avt'>
    {employeeData.image ? <img src={getImageUrl(employeeData.image)} alt="Employee" width="100px" height="100px" /> : <p>No image available</p>}
</label>


          </div>
        </div>
        <Tabs style={{ backgroundColor: '#fff' }}>
          <TabList className="tablist2">
            <Tab className={`tab-item ${tabIndex2 === 0 ? 'active' : ''}`} onClick={() => setTabIndex2(0)}>Tiếp tục</Tab>
            <Tab className={`tab-item ${tabIndex2 === 1 ? 'active' : ''}`} onClick={() => setTabIndex2(1)}>Thông tin công việc</Tab>
            <Tab className={`tab-item ${tabIndex2 === 2 ? 'active' : ''}`} onClick={() => setTabIndex2(2)}>Thông tin riêng tư</Tab>
            <Tab className={`tab-item ${tabIndex2 === 3 ? 'active' : ''}`} onClick={() => setTabIndex2(3)}>Thiết lập nhân lực</Tab>
          </TabList>
          <TabPanel>
            <div className='container-grid'>
              <div className="form-grid grid-item">
                <label>KỸ NĂNG</label>
                {employeeData.skills.map((skill, index) => (
                  <div key={index} className="item-info">
                    <input
                      type="text"
                      value={skill.name}
                      placeholder="Skill Name"
                    />
                    <select
                      value={skill.proficiency}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="form-grid grid-item">
                <label>KINH NGHIỆM</label>
                {employeeData.experiences.map((experience, index) => (
                  <div key={index} className="item-info">
                    <input
                      type="text"
                      value={experience.jobTitle}
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={experience.company}
                      placeholder="Company"
                    />
                    <input
                      type="date"
                      value={experience.startDate}
                    />
                    <input
                      type="date"
                      value={experience.endDate}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            Thông tin công việc
          </TabPanel>
          <TabPanel>
            <div className='container-grid'>
              <div className="form-grid grid-item">
                <label>LIÊN HỆ CÁ NHÂN</label>
                <div className="item-info">
                  <label>Email cá nhân</label>
                  <input type="text" name="personalInfo.personalEmail" value={employeeData.personalInfo.personalEmail} />
                </div>
              </div>

              <div className="form-grid grid-item">
                <label>LIÊN HỆ KHẨN CẤP</label>
                <div className="item-info">
                  <label >Tên liên hệ</label>
                  <input type="text" name="nameContactER" value={employeeData.nameContactER} />
                </div>
                <div className="item-info">
                  <label >Số điện thoại</label>
                  <input type="text" name="phoneContactER" value={employeeData.phoneContactER} />
                </div>
              </div>
              <div className="form-grid grid-item">
                <label>CÔNG DÂN</label>
                <div className="item-info">
                  <label>Quốc tịch</label>
                  <input type="text" name="personalInfo.nationality" value={employeeData.personalInfo.nationality} className='f' />
                </div>
                <div className="item-info">
                  <label>Nơi sinh</label>
                  <select name="personalInfo.birthPlace" value={employeeData.personalInfo.birthPlace} >
                    <option value="">Chọn tỉnh ...</option>
                    {provinces.map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="item-info">
                  <label>Giới tính</label>
                  <select name="personalInfo.sex" value={employeeData.personalInfo.sex} >
                    <option value="">Chọn giới tính...</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="item-info">
                  <label>Ngày sinh</label>
                  <input type="date" name="personalInfo.birthDate" value={employeeData.personalInfo.birthDate} />
                </div>
                <div className="item-info">
                  <label htmlFor="identityCardNumber">Số CCCD</label>
                  <input type="text" name="personalInfo.identityCardNumber" value={employeeData.personalInfo.identityCardNumber}  />
                </div>
              </div>
              <div className="form-grid grid-item">
                <label>GIÁO DỤC</label>
                <div className="item-info">
                  <label>Cấp bằng</label>
                  <select name="personalInfo.certificateLevel" value={employeeData.personalInfo.certificateLevel} >
                    <option value="">Chọn cấp...</option>
                    <option value="Tốt nghiệp">Tốt nghiệp</option>
                    <option value="Cử nhân">Cử nhân</option>
                    <option value="Thạc sĩ">Thạc sĩ</option>
                    <option value="Tiến sĩ">Tiến sĩ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="item-info">
                  <label>Chuyên ngành</label>
                  <input type="text" name="personalInfo.fieldOfStudy" value={employeeData.personalInfo.fieldOfStudy}  />
                </div>
                <div className="item-info">
                  <label>Trường học</label>
                  <input type="text" name="personalInfo.school" value={employeeData.personalInfo.school}  />
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            Tttt
          </TabPanel>
        </Tabs>
      </Tabs>
    </>
  );

}
