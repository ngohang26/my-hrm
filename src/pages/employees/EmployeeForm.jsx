import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './employee.css'
import { apiUrl } from '../../config'

const EmployeeForm = ({ mode, currentEmployee, setTabIndex, setShowEditTab, positions, departments, fetchEmployees, selectedPositionId, setSelectedPositionId, selectedDepartmentId, setSelectedDepartmentId }) => {
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
	const handlePositionChange = (e) => {
		setSelectedPositionId(e.target.value);
	};

	const handleDepartmentChange = (e) => {
		setSelectedDepartmentId(e.target.value);
	};
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
	const [skillNames, setSkillNames] = useState([]);
	const [experienceNames, setExperienceNames] = useState([]);
	useEffect(() => {
		const token = localStorage.getItem("accessToken")
		const fetchSkillNames = async () => {
			const response = await fetch(`${apiUrl}/api/skillNames`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();
			setSkillNames(data);
		}
		fetchSkillNames();
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("accessToken")
		const fetchExperienceNames = async () => {
			const response = await fetch(`${apiUrl}/api/experienceNames`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();
			setExperienceNames(data);
		}
		fetchExperienceNames();
	}, []);

useEffect(() => {
    const fetchProvinces = async () => {
        const response = await fetch(`https://vapi.vnappmob.com/api/province`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        const provinceNames = data.results.map(results => results.province_name);
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
		const token = localStorage.getItem('accessToken');

		const response = await fetch(`${apiUrl}/api/FileUpload`, {
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
		return `${apiUrl}/api/FileUpload/files/images/${image}`;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		const [parent, child] = name.split('.');

		if (parent && child) {
			setEmployeeData(prevState => ({
				...prevState,
				personalInfo: {
					...prevState.personalInfo,
					[child]: value
				},
				position: {
					...prevState.position,
					[child]: value
				},
				department: {
					...prevState.department,
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
			image: image,
			position: { id: selectedPositionId },
			department: { id: selectedDepartmentId },

		};

		console.log("Data sent to server:", employeeToSend);
		const token = localStorage.getItem('accessToken');

		try {
			let response;
			if (mode === 'add') {
				response = await fetch(`${apiUrl}/employees/addEmployee`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(employeeToSend),
				});
			} else if (mode === 'edit') {
				response = await fetch(`${apiUrl}/employees/${employeeToSend.id}`, {
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
					toast.success('Thêm nhân viên thành công');
					fetchEmployees();
					setTimeout(() => {
						setTabIndex(0);
					}, 1200);
				} else if (mode === 'edit') {
					toast.success('Chỉnh sửa thông tin nhân viên thành công');
					fetchEmployees();
					setShowEditTab(false)
					setTimeout(() => {
						setTabIndex(0);
					}, 1000);

				}
			} else {
				const errorResponse = await response.text();
				toast.error(errorResponse);
			}
		} catch (error) {
			console.error('Failed to handle employee:', error);
		}

	};


	return (
		<>
			<ToastContainer />
			<form onSubmit={handleSubmit}>
				<input type="submit" value="Lưu" className='btn-submit' style={{ margin: '0px 0px  0px 10px' }} />
				<Tabs>
					<div>
						<div className='employee-info' style={{ display: "flex", flexWrap: 'wrap' }}>
							<div className="" style={{ flex: '2 0 50%', padding: '10px' }}>
								<input type="text" name="fullName" id='fullName' value={employeeData.fullName} onChange={handleChange} placeholder="Full Name" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90.5%', margin: '20px 0px' }} />
								<div style={{ display: "flex", gap: '20px', width: '101%' }}>

									<select name="positionName" value={selectedPositionId} onChange={handlePositionChange} className='form-control select' >
										<option value=''>Chọn chức vụ ...</option>
										{positions && positions.map((position, index) => (
											<option key={index} value={position.id}>
												{position.positionName}
											</option>
										))}
									</select>
									<select name="departmentName" value={selectedDepartmentId} onChange={handleDepartmentChange} className='form-control select'>
										<option value=''>Chọn bộ phận ...</option>
										{departments && departments.map((department, index) => (
											<option key={index} value={department.id}>
												{department.departmentName}
											</option>
										))}
									</select>
								</div>
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
									{skillNames.map((skillName, index) => {
										const skill = employeeData.skills.find(s => s.skillName.id === skillName.id);
										return (
											<div key={index} className="skill-experience-item">
												<label>{skillName.name}</label>
												<progress value={skill?.rating || 0} max="100" />
												<div className='skill-experience-input'>

													<input type="number" min="0" max="100" value={skill?.rating || ''} onChange={e => {
														let newSkills = [...employeeData.skills];
														if (skill) {
															newSkills = newSkills.map(s => s.skillName.id === skillName.id ? { ...s, rating: e.target.value } : s);
														} else {
															newSkills.push({ skillName: { id: skillName.id }, rating: e.target.value });
														}
														setEmployeeData(prevState => ({ ...prevState, skills: newSkills }));
													}} />
													<span>%</span>
												</div>
											</div>
										);
									})}

								</div>

								<div className="form-grid grid-item">
									<label>KINH NGHIỆM</label>
									{experienceNames.map((experienceName, index) => {
										const experience = employeeData.experiences.find(s => s.experienceName.id === experienceName.id);
										return (
											<div key={index} className="skill-experience-item">
												<label>{experienceName.name}</label>
												<progress value={experience?.rating || 0} max="100" />
												<div className='skill-experience-input'>
													<input type="number" min="0" max="100" value={experience?.rating || ''} onChange={e => {
														let newSkills = [...employeeData.experiences];
														if (experience) {
															newSkills = newSkills.map(s => s.experienceName.id === experienceName.id ? { ...s, rating: e.target.value } : s);
														} else {
															newSkills.push({ experienceName: { id: experienceName.id }, rating: e.target.value });
														}
														setEmployeeData(prevState => ({ ...prevState, experiences: newSkills }));
													}} />
													<span>%</span>
												</div>
											</div>
										);
									})}

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
