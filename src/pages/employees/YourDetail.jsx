import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { apiUrl } from '../../config'
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const YourDetail = () => {
  const [tabIndex2, setTabIndex2] = useState(0);
  const getImageUrl = (image) => {
    return `${apiUrl}/api/FileUpload/files/images/${image}`;
  };
  const [employeeData, setEmployeeData] = useState({
    fullName: '',
    phoneNumber: '',
    image: '',
    workEmail: '',
    position: {
      positionName: ''
    },
    department: {
      departmentName: ''
    },
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
        const response = await fetch(`${apiUrl}/employees/employee/${employeeCode}`, {
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
    <HelmetProvider>
      <ToastContainer />
      <Helmet>
        <title>Chi tiết nhân viên</title>
      </Helmet>
      <Tabs>
        <div>
          <div className='employee-info' style={{ display: "flex", flexWrap: 'wrap' }}>
            <div className="" style={{ flex: '2 0 50%', padding: '10px' }}>
              <input type="text" name="fullName" id='fullName' defaultValue={employeeData.fullName} className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90.5%', margin: '20px 0px' }} readOnly />
              <div style={{ display: "flex", gap: '20px', width: '101%' }}>

                <select className='form-control select' disabled>
                  <option>{employeeData.position.positionName}</option>
                </select>

                <select className='form-control select' disabled>
                  <option>{employeeData.department.departmentName}</option>
                </select>

              </div>
              <div style={{ display: "flex", gap: '20px', width: '93%' }}>
                <input type="text" name="phoneNumber" defaultValue={employeeData.phoneNumber} className='form-control more' />
                <input type="text" name="workEmail" defaultValue={employeeData.workEmail} className='form-control more' />
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
            <Tab className={`tab-item ${tabIndex2 === 1 ? 'active' : ''}`} onClick={() => setTabIndex2(1)}>Thông tin riêng tư</Tab>
          </TabList>
          <TabPanel>
            <div className='container-grid'>
              <div className="form-grid grid-item">
                <label>KỸ NĂNG</label>
                {employeeData.skills.map((skill, index) => (
                  <div key={index} className="skill-experience-item">
                    <label>{skill.skillName.name}</label>
                    <progress value={skill.rating || 0} max="100" />
                    <div className='skill-experience-input'>
                      <input type="number" min="0" max="100" value={skill.rating || ''} readOnly />
                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-grid grid-item">
                <label>KINH NGHIỆM</label>
                {employeeData.experiences.map((experience, index) => (
                  <div key={index} className="skill-experience-item">
                    <label>{experience.experienceName.name}</label>
                    <progress value={experience.rating || 0} max="100" />
                    <div className='skill-experience-input'>
                      <input type="number" min="0" max="100" value={experience.rating || ''} readOnly />
                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  <input type="text" name="personalInfo.birthPlace" value={employeeData.personalInfo.birthPlace} />
                </div>
                <div className="item-info">
                  <label>Giới tính</label>
                  <select name="personalInfo.sex" value={employeeData.personalInfo.sex} disabled >
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
                  <input type="text" name="personalInfo.identityCardNumber" value={employeeData.personalInfo.identityCardNumber} />
                </div>
              </div>
              <div className="form-grid grid-item">
                <label>GIÁO DỤC</label>
                <div className="item-info">
                  <label>Cấp bằng</label>
                  <select name="personalInfo.certificateLevel" value={employeeData.personalInfo.certificateLevel} disabled>
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
                  <input type="text" name="personalInfo.fieldOfStudy" value={employeeData.personalInfo.fieldOfStudy} />
                </div>
                <div className="item-info">
                  <label>Trường học</label>
                  <input type="text" name="personalInfo.school" value={employeeData.personalInfo.school} />
                </div>
              </div>
            </div>
          </TabPanel>

        </Tabs>
      </Tabs>
    </HelmetProvider>
  );

}
