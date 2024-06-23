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
		image: 'c1435efb00d84241b953a21e912ed8ce.png',
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
	const [selectedDepartmentName, setSelectedDepartmentName] = useState('');
	const [isFileUploaded, setIsFileUploaded] = useState(false);

	const handlePositionChange = (e) => {
		const selectedPositionId = Number(e.target.value); // Chuyển đổi thành số
		setSelectedPositionId(selectedPositionId);

		const selectedPosition = positions.find(position => position.id === selectedPositionId);

		if (selectedPosition) {
			setSelectedDepartmentId(selectedPosition.department.id);
			setSelectedDepartmentName(selectedPosition.department.departmentName);
		}
	};

	useEffect(() => {
		const selectedPosition = positions.find(position => position.id === selectedPositionId);

		if (selectedPosition) {
			setSelectedDepartmentName(selectedPosition.department.departmentName);
		}

	}, [selectedPositionId, selectedDepartmentName]);

	useEffect(() => {
		if (mode === 'edit' && currentEmployee) {
			setEmployeeData(currentEmployee);
			setSelectedFile(currentEmployee.image);
		} else {
			setEmployeeData({
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


	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		setSelectedFile(file);
		setIsFileUploaded(false);

		if (file) {
			const uploadedFilePath = await handleUpload(file);
			if (uploadedFilePath) {
				setIsFileUploaded(true);
			}
		}
	};


	const handleUpload = async (file) => {
		const formData = new FormData();
		formData.append('file', file);
		const token = localStorage.getItem('accessToken');

		const response = await fetch(`${apiUrl}/api/FileUpload`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formData,
		});
		if (response.ok) {
			const data = await response.json();
			setEmployeeData(prevState => ({
				...prevState,
				image: data.generatedFileName
			}));
			console.log("Response from FileUpload:", data);
			toast.success(data.message);
			return data.generatedFileName;
		} else {
			const errorText = await response.text();
			console.log("Error from FileUpload:", errorText);
			toast.error(errorText);
			return null;
		}
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

		if (selectedFile instanceof File && !isFileUploaded) {
			image = await handleUpload(selectedFile);
		} else {
			console.log("No file selected or user did not choose to update the image.");
		}

		const employeeToSend = {
			...employeeData,
			image: image,
			position: { id: selectedPositionId },
			department: { id: selectedDepartmentId },

		};

		// console.log("Data sent to server:", employeeToSend);
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
					setTimeout(() => {
						setTabIndex(0);
						setShowEditTab(false)
					}, 1200);

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
								{/* <input type="text" name="fullName" id='fullName' value={employeeData.fullName} onChange={handleChange} placeholder="Họ tên nhân viên" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90.5%', margin: '20px 0px' }} /> */}
								{employeeData.fullName !== null && (
									<input type="text" name="fullName" id='fullName' value={employeeData.fullName} onChange={handleChange} placeholder="Họ tên nhân viên" className='form-control' style={{ height: '50px', fontSize: '26px', fontWeight: "600", width: '90.5%', margin: '20px 0px' }} />
								)}

								<div style={{ display: "flex", gap: '20px', width: '101%' }}>

									<select name="positionName" value={selectedPositionId} onChange={handlePositionChange} className='form-control select' >
										<option value=''>Chọn chức vụ ...</option>
										{positions && positions.map((position, index) => (
											<option key={index} value={position.id}>
												{position.positionName}
											</option>
										))}
									</select>
									<input value={selectedDepartmentName} disabled style={{ width: '42.5%', cursor: 'pointer', border: '1px solid #ced4da', borderColor: '#e8e9e9', fontSize: '16px', borderRadius: '5px', backgroundColor: '#fff', paddingLeft: '20px' }} />
								</div>
								<div style={{ display: "flex", gap: '20px', width: '93%' }}>
									<input type="text" name="phoneNumber" value={employeeData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className='form-control more' />
									<input type="text" name="workEmail" value={employeeData.workEmail} onChange={handleChange} placeholder="Work Email" className='form-control more' />
								</div>
							</div>
							<label className='empl-avt'>
								<input type="file" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute' }} />
								{selectedFile instanceof File && isFileUploaded ?
									<img src={URL.createObjectURL(selectedFile)} alt="Preview" /> :
									<img src={mode === 'add' ? defaultImage : getImageUrl(employeeData.image)} alt="Default" width="100px" height="100px" />}

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
									<label id='a'>KỸ NĂNG</label>
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
									<label id='a'>KINH NGHIỆM</label>
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
							<div className='container-grid'>
								<div className="form-grid grid-item">
									<label id='a'>LIÊN HỆ CÁ NHÂN</label>
									<div className="item-info">
										<label>Email cá nhân</label>
										<input type="text" name="personalInfo.personalEmail" value={employeeData.personalInfo.personalEmail} onChange={handleChange} />
									</div>
								</div>

								<div className="form-grid grid-item">
									<label id='a'>LIÊN HỆ KHẨN CẤP</label>
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
									<label id='a'>CÔNG DÂN</label>
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
									<label id='a'>GIÁO DỤC</label>
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

					</Tabs>
				</Tabs>
			</form >
		</>
	);
};

export default EmployeeForm;
