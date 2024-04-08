import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './employee.css'
const EmployeeForm = ({ mode, currentEmployee, setTabIndex, setShowEditTab, positions, departments }) => {
    const defaultImage = '/placeholder.png';

    const [employeeData, setEmployeeData] = useState({
        fullName: '',
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
                fullName: '',
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
                    identityCardNumber: '',
                    personalEmail: '',
                    fieldOfStudy: '',
                    school: ''
                },
                skills: [],
                experiences: []
            });
        }
    }, [currentEmployee, mode]);

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
                    [child]: value // Cập nhật trường con cụ thể
                }
            }));
        } else {
            // Nếu không có đường dẫn con, cập nhật trường thông thường
            setEmployeeData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra trường fullName trong trạng thái employeeData
        if (!employeeData.fullName.trim()) {
            toast.error('Please enter your full name.');
        } else {
            let image = employeeData.image;
            if (selectedFile) {
                image = await handleUpload();
            } else {
                console.log("No file selected.");
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
                        },
                        body: JSON.stringify(employeeToSend),
                    });
                } else if (mode === 'edit') {
                    response = await fetch(`http://localhost:8080/employees/${employeeToSend.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(employeeToSend),
                    });
                }
    
                if (response.ok) {
                    if (mode === 'add') {
                        toast.success('Thêm bộ phận thành công');
                    } else if (mode === 'edit') {
                        toast.success('Chỉnh sửa bộ phận thành công');
                    }
                } else {
                    // Handle error response from server
                    const errorMessage = await response.text();
                    toast.error(errorMessage);
                }
            } catch (error) {
                console.error('Failed to handle department:', error);
            }
        }
    };
    

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     let image = employeeData.image;
    //     if (selectedFile) {
    //         image = await handleUpload();
    //     } else {
    //         console.log("No file selected.");
    //     }

    //     const employeeToSend = {
    //         ...employeeData,
    //         image: image
    //     };

    //     console.log("Data sent to server:", employeeToSend);

    //     if (mode === 'add') {
    //         fetch('http://localhost:8080/employees/addEmployee', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(employeeToSend),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 // console.log('Success:', data);
    //                 toast.success("Thêm nhân viên thành công")
    //                 setTimeout(() => {
    //                     setTabIndex(0);
    //                 }, 1200);

    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //             });
    //     } else if (mode === 'edit') {
    //         fetch(`http://localhost:8080/employees/${employeeToSend.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(employeeToSend),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 // console.log('Success:', data);
    //                 toast.success("Sửa nhân viên thành công")
    //                 setTimeout(() => {
    //                     setTabIndex(0);
    //                     setShowEditTab(false);
    //                 }, 1200);
    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //             });
    //     }
    // };

    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <input type="submit" value="Submit" />

                <Tabs>
                    <TabPanel>
                        <div className='employee-info' style={{ display: "flex", flexWrap: 'wrap' }}>
                            <div className="" style={{ flex: '2 0 50%', padding: '10px' }}>
                                <input type="text" name="fullName" id='fullName' value={employeeData.fullName} onChange={handleChange} placeholder="Full Name" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90%', margin: '20px 0px' }} required />
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
