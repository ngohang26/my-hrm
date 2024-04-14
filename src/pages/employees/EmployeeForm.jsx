import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './employee.css'
const EmployeeForm = ({ mode, currentEmployee, setTabIndex, setShowEditTab, positions, departments, fetchEmployees }) => {
    const defaultImage = '/placeholder.png';

    const [employeeData, setEmployeeData] = useState({
        fullName: null,
        phoneNumber: '',
        image: defaultImage,
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
            personalEmail: '',
            fieldOfStudy: '',
            school: ''
        },
        skills: [],
        experiences: []
    });
    const [selectedFile, setSelectedFile] = useState();
    const [provinces, setProvinces] = useState([]);
    const [tabIndex2, setTabIndex2] = useState(0);
    useEffect(() => {
        if (mode === 'edit' && currentEmployee) {
            setEmployeeData(currentEmployee);
            setSelectedFile(currentEmployee.image); // Cập nhật selectedFile
        } else {
            setEmployeeData({
                fullName: null,
                phoneNumber: '',
                image: defaultImage,
                workEmail: '',
                positionName: '',
                departmentName: '',
                personalInfo: {
                    nationality: '',
                    birthPlace: '',
                    isResident: true,
                    sex: '',
                    birthDate: '',
                    identityCardNumber: null,
                    personalEmail: '',
                    fieldOfStudy: '',
                    school: ''
                },
                skills: [],
                experiences: []
            });
        }
    }, [currentEmployee, mode]);

    const addSkill = () => {
        setEmployeeData(prevState => ({
            ...prevState,
            skills: [...prevState.skills, { name: '', proficiency: '' }]
        }));
    };

    const handleSkillChange = (e, index) => {
        const { value } = e.target;
        setEmployeeData(prevState => ({
            ...prevState,
            skills: prevState.skills.map((skill, i) =>
                i === index ? { ...skill, name: value } : skill
            )
        }));
    };

    const handleSkillProficiencyChange = (e, index) => {
        const { value } = e.target;
        setEmployeeData(prevState => ({
            ...prevState,
            skills: prevState.skills.map((skill, i) =>
                i === index ? { ...skill, proficiency: value } : skill
            )
        }));
    };

    const removeSkill = (index) => {
        setEmployeeData(prevState => ({
            ...prevState,
            skills: prevState.skills.filter((_, i) => i !== index)
        }));
    };

    const addExperience = () => {
        setEmployeeData(prevState => ({
            ...prevState,
            experiences: [...prevState.experiences, { jobTitle: '', company: '', startDate: '', endDate: '' }]
        }));
    };

    const handleExperienceChange = (e, index) => {
        const { value } = e.target;
        setEmployeeData(prevState => ({
            ...prevState,
            experiences: prevState.experiences.map((experience, i) =>
                i === index ? { ...experience, jobTitle: value } : experience
            )
        }));
    };

    const handleExperienceCompanyChange = (e, index) => {
        const { value } = e.target;
        setEmployeeData(prevState => ({
            ...prevState,
            experiences: prevState.experiences.map((experience, i) =>
                i === index ? { ...experience, company: value } : experience
            )
        }));
    };

    const handleExperienceStartDateChange = (e, index) => {
        const { value } = e.target;
        setEmployeeData(prevState => ({
            ...prevState,
            experiences: prevState.experiences.map((experience, i) =>
                i === index ? { ...experience, startDate: value } : experience
            )
        }));
    };

    const handleExperienceEndDateChange = (e, index) => {
        const { value } = e.target;
        setEmployeeData(prevState => ({
            ...prevState,
            experiences: prevState.experiences.map((experience, i) =>
                i === index ? { ...experience, endDate: value } : experience
            )
        }));
    };

    const removeExperience = (index) => {
        setEmployeeData(prevState => ({
            ...prevState,
            experiences: prevState.experiences.filter((_, i) => i !== index)
        }));
    };

    const token = localStorage.getItem('accessToken');

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
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('http://localhost:8080/api/FileUpload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        const data = await response.json();
        if (data) {
            console.log("Response from FileUpload:", data);
        }

        return data.generatedFileName;
    };

    const getImageUrl = (image) => {
        return `http://localhost:8080/api/FileUpload/files/${image}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [parent, child] = name.split('.'); // Tách đường dẫn

        if (parent && child) {
            setEmployeeData(prevState => ({
                ...prevState,
                personalInfo: {
                    ...prevState.personalInfo,
                    [child]: value
                }
            }));
        } else {
            setEmployeeData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employeeData.fullName) {
            toast.error('Vui lòng nhập đầy đủ tên');
            return;
        } else if (!employeeData.identityCardNumber) {
            toast.error('Vui lòng nhập số căn cước công dân')
        } else {
            let image = employeeData.image;

            if (selectedFile instanceof File) {
                image = await handleUpload();
            } else if (!employeeData.image || employeeData.image === defaultImage) {
                image = defaultImage;
            } else {
                console.log("No file selected or user did not choose to update the image.");
            }

            const employeeToSend = {
                ...employeeData,
                image: image
            };

            console.log("Data sent to server:", employeeToSend);

            try {
                let response;
                if (mode === 'add') {
                    response = await fetch('http://localhost:8080/employees/addEmployee', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(employeeToSend),
                    });
                } else if (mode === 'edit') {
                    response = await fetch(`http://localhost:8080/employees/${employeeToSend.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                          },
                        body: JSON.stringify(employeeToSend),
                    });
                }

                if (response.ok) {
                    if (mode === 'add') {
                        toast.success('Thêm bộ phận thành công');
                        fetchEmployees();
                        setTimeout(() => {
                            setTabIndex(0);
                        }, 1200);
                    } else if (mode === 'edit') {
                        toast.success('Chỉnh sửa bộ phận thành công');
                        fetchEmployees();
                        setTimeout(() => {
                            setTabIndex(0);
                        }, 1200);

                    }
                } else {
                    const errorMessage = await response.text();
                    toast.error(errorMessage);
                }
            } catch (error) {
                console.error('Failed to handle department:', error);
            }
        }
    };


    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <input type="submit" value="Submit" />

                <Tabs>
                    <TabPanel>
                        <div className='employee-info' style={{ display: "flex", flexWrap: 'wrap' }}>
                            <div className="" style={{ flex: '2 0 50%', padding: '10px' }}>
                                <input type="text" name="fullName" id='fullName' value={employeeData.fullName} onChange={handleChange} placeholder="Full Name" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90%', margin: '20px 0px' }} />
                                <select name="positionName" value={employeeData.positionName} onChange={handleChange} className='form-control select' >
                                    <option value=''>Chọn chức vụ ...</option>
                                    {positions && positions.map((position, index) => (
                                        <option key={index} value={position.positionName}>
                                            {position.positionName}
                                        </option>
                                    ))}
                                </select>

                                <select name="departmentName" value={employeeData.departmentName} onChange={handleChange} className='form-control select'>
                                    <option value=''>Chọn bộ phận ...</option>
                                    {departments && departments.map((department, index) => (
                                        <option key={index} value={department.departmentName}>
                                            {department.departmentName}
                                        </option>
                                    ))}
                                </select>

                                <div style={{ display: "flex", gap: '20px', width: '93%' }}>
                                    <input type="text" name="phoneNumber" value={employeeData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className='form-control more' />
                                    <input type="text" name="workEmail" value={employeeData.workEmail} onChange={handleChange} placeholder="Work Email" className='form-control more' />
                                </div>
                            </div>
                            <label className='empl-avt'>
                                <input type="file" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute' }} />
                                {selectedFile instanceof File ? <img src={URL.createObjectURL(selectedFile)} alt="Preview" /> : <img src={mode === 'add' ? defaultImage : getImageUrl(employeeData.image)} alt="Default" width="100px" height="100px" />}
                            </label>
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
                            <div className='container-grid'>
                                {/* Phần nhập thông tin kỹ năng */}
                                <div className="form-grid grid-item">
                                    <label>KỸ NĂNG</label>
                                    {employeeData.skills.map((skill, index) => (
                                        <div key={index} className="item-info">
                                            <input
                                                type="text"
                                                value={skill.name}
                                                onChange={e => handleSkillChange(e, index)}
                                                placeholder="Skill Name"
                                            />
                                            <select
                                                value={skill.proficiency}
                                                onChange={e => handleSkillProficiencyChange(e, index)}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                            <button onClick={() => removeSkill(index)}>Remove</button>
                                        </div>
                                    ))}
                                    <button onClick={addSkill}>Add Skill</button>
                                </div>

                                {/* Phần nhập thông tin kinh nghiệm */}
                                <div className="form-grid grid-item">
                                    <label>KINH NGHIỆM</label>
                                    {employeeData.experiences.map((experience, index) => (
                                        <div key={index} className="item-info">
                                            <input
                                                type="text"
                                                value={experience.jobTitle}
                                                onChange={e => handleExperienceChange(e, index)}
                                                placeholder="Job Title"
                                            />
                                            <input
                                                type="text"
                                                value={experience.company}
                                                onChange={e => handleExperienceCompanyChange(e, index)}
                                                placeholder="Company"
                                            />
                                            <input
                                                type="date"
                                                value={experience.startDate}
                                                onChange={e => handleExperienceStartDateChange(e, index)}
                                            />
                                            <input
                                                type="date"
                                                value={experience.endDate}
                                                onChange={e => handleExperienceEndDateChange(e, index)}
                                            />
                                            <button onClick={() => removeExperience(index)}>Remove</button>
                                        </div>
                                    ))}
                                    <button onClick={addExperience}>Add Experience</button>
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
                                        <input type="text" name="personalInfo.personalEmail" value={employeeData.personalInfo.personalEmail} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="form-grid grid-item">
                                    <label>LIÊN HỆ KHẨN CẤP</label>
                                    <div className="item-info">
                                        <label >Tên liên hệ</label>
                                        <input type="text" name="nameContactER" value={employeeData.nameContactER} onChange={handleChange} />
                                    </div>
                                    <div className="item-info">
                                        <label >Số điện thoại</label>
                                        <input type="text" name="phoneContactER" value={employeeData.phoneContactER} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-grid grid-item">
                                    <label>CÔNG DÂN</label>
                                    <div className="item-info">
                                        <label>Quốc tịch</label>
                                        <input type="text" name="personalInfo.nationality" value={employeeData.personalInfo.nationality} onChange={handleChange} className='f' />
                                    </div>
                                    <div className="item-info">
                                        <label>Nơi sinh</label>
                                        <select name="personalInfo.birthPlace" value={employeeData.personalInfo.birthPlace} onChange={handleChange}>
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
                                        <select name="personalInfo.sex" value={employeeData.personalInfo.sex} onChange={handleChange}>
                                            <option value="">Chọn giới tính...</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                    <div className="item-info">
                                        <label>Ngày sinh</label>
                                        <input type="date" name="personalInfo.birthDate" value={employeeData.personalInfo.birthDate} onChange={handleChange} />
                                    </div>
                                    <div className="item-info">
                                        <label htmlFor="identityCardNumber">Số CCCD</label>
                                        <input type="text" name="personalInfo.identityCardNumber" value={employeeData.personalInfo.identityCardNumber} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-grid grid-item">
                                    <label>GIÁO DỤC</label>
                                    <div className="item-info">
                                        <label>Cấp bằng</label>
                                        <select name="personalInfo.certificateLevel" value={employeeData.personalInfo.certificateLevel} onChange={handleChange}>
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
                                        <input type="text" name="personalInfo.fieldOfStudy" value={employeeData.personalInfo.fieldOfStudy} onChange={handleChange} />
                                    </div>
                                    <div className="item-info">
                                        <label>Trường học</label>
                                        <input type="text" name="personalInfo.school" value={employeeData.personalInfo.school} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            Tttt
                        </TabPanel>
                    </Tabs>
                </Tabs>
            </form >
        </>
    );
};

export default EmployeeForm;
