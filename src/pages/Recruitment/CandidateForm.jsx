import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './CandidateForm.css'
import { CircularProgress } from '@mui/material';
import { apiUrl } from '../../config'

const CandidateForm = ({ mode, currentCandidate, setTabIndex, setShowEditTab, jobPositions, fetchCandidates, selectedJobPositionId, setSelectedJobPositionId }) => {
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState();
	const [isFileUploaded, setIsFileUploaded] = useState(false);
	const [tabIndex2, setTabIndex2] = useState(0);
	const [skillNames, setSkillNames] = useState([]);
	const [experienceNames, setExperienceNames] = useState([]);

	const handleJobPositionChange = (e) => {
		setSelectedJobPositionId(e.target.value);
	};

	const [candidateData, setCandidateData] = useState({
		candidateName: '',
		email: '',
		jobPositionName: '',
		resumeFilePath: '',
		dateApplied: '',
		skills: [],
		experiences: [],
		interviewTime: '',
		secondInterviewTime: '',
		firstInterviewStatus: 'NOT_APPLICABLE',
		secondInterviewStatus: 'NOT_APPLICABLE',
		jobOffer: {
			startDate: '',
			endDate: '',
			noteContract: '',
			monthlySalary: '',
		}
	});

	useEffect(() => {
		if (mode === 'edit' && currentCandidate) {
			setCandidateData(currentCandidate);
			setSelectedFile(currentCandidate.resumeFilePath);
		} else {
			setCandidateData({
				candidateName: '',
				email: '',
				jobPositionName: '',
				resumeFilePath: '',
				dateApplied: '',
				skills: [],
				experiences: [],
				interviewTime: '',
				secondInterviewTime: '',
				firstInterviewStatus: '',
				secondInterviewStatus: '',
				jobOffer: {
					startDate: '',
					endDate: '',
					noteContract: '',
					monthlySalary: '',
				}
			});
		}
	}, [currentCandidate, mode]);

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

	const handleChange = (e) => {
		const { name, value } = e.target;
		const [parent, child] = name.split('.');

		if (parent && child) {
			setCandidateData(prevState => ({
				...prevState,
				jobPosition: {
					...prevState.jobPosition,
					[child]: value
				}
			}));
		} else {
			setCandidateData(prevState => ({
				...prevState,
				[name]: value
			}));
		}
	};
	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		setSelectedFile(file);
		if (file && !isFileUploaded) {
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

		const response = await fetch(`${apiUrl}/api/FileUpload/uploadResume`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formData,
		});
		if (response.ok) {
			const data = await response.json();
			setCandidateData(prevState => ({
				...prevState,
				resumeFilePath: data.generatedFileName
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		let resumeFilePath = candidateData.resumeFilePath;

		if (selectedFile instanceof File && !isFileUploaded) {
			resumeFilePath = await handleUpload(selectedFile);
		} else {
			console.log("File đã được upload hoặc không có file mới.");
		}
		setLoading(true)
		const candidateToSend = {
			...candidateData,
			resumeFilePath: resumeFilePath,
			jobPosition: { id: selectedJobPositionId },
			firstInterviewStatus: candidateData.firstInterviewStatus || 'NOT_APPLICABLE',
			secondInterviewStatus: candidateData.secondInterviewStatus || 'NOT_APPLICABLE',
			jobOffer: null
		};

		console.log("Data sent to server:", candidateToSend);
		const token = localStorage.getItem('accessToken');

		try {
			let response;
			if (mode === 'add') {
				response = await fetch(`${apiUrl}/candidates/addCandidate`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(candidateToSend),
				});
			} else if (mode === 'edit') {
				response = await fetch(`${apiUrl}/candidates/update/${candidateToSend.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(candidateToSend),
				});
			}

			if (response.ok) {
				if (mode === 'add') {
					toast.success('Thêm nhân viên thành công');
					fetchCandidates();
					setTimeout(() => {
						setTabIndex(0);
					}, 1200);
				} else if (mode === 'edit') {
					toast.success('Chỉnh sửa thông tin nhân viên thành công');
					fetchCandidates();
					setTimeout(() => {
						setTabIndex(0);
						setShowEditTab(false)
					}, 1000);

				}
			} else {
				const errorResponse = await response.text();
				toast.error(errorResponse);
			}
		} catch (error) {
			console.error('Failed to handle candidate:', error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<ToastContainer />
			{loading && (
				<div className="overlay">
					<div className="root">
						<CircularProgress />
					</div>
				</div>
			)}
			<form onSubmit={handleSubmit} className={loading ? 'blur' : ''}>
				<input type="submit" value="Lưu" className='btn-submit' style={{ margin: '0px 0px  0px 10px' }} />
				<Tabs>
					<div>
						<div class='candidate-info'>
							<div class='input-group'>
								<div>
									{candidateData.candidateName !== null && (
										<input type="text" name="candidateName" id='candidateName' value={candidateData.candidateName} placeholder='Họ và tên' onChange={handleChange} className='form-control more' />

									)}
								</div>
								<div>
									<select name="positionName" value={selectedJobPositionId} onChange={handleJobPositionChange} className='form-control select' >
										<option value=''>Chọn chức vụ ...</option>
										{jobPositions && jobPositions.map((jobPosition, index) => (
											<option key={index} value={jobPosition.id}>
												{jobPosition.jobPositionName}
											</option>
										))}
									</select>
								</div>
							</div>
							<div class='input-group'>
								<div>
									<input type="text" name="phoneNumber" value={candidateData.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" className='form-control more' />
								</div>
								<div>
									<input type="text" name="email" value={candidateData.email} onChange={handleChange} placeholder="Địa chỉ email" className='form-control more' />
								</div>
							</div>
							<div class='input-group'>
								<div>
									<input type="date" name="dateApplied" value={candidateData.dateApplied} onChange={handleChange} placeholder="Ngày ứng tuyển" className='form-control more' />
								</div>
								<div>
									<div>
										<label for="cvUpload" id='cvUpLoadLabel'>Tải lên CV (Chấp nhận .docx, .doc, .pdf, .rtf, .txt tối đa 5MB)</label>
										<input type="file" id="cvUpload" onChange={handleFileChange} className='form-control more' style={{ marginTop: '0px' }} />
										{candidateData.resumeFilePath && (
											<a href={`${apiUrl}/api/FileUpload/files/resumes/${candidateData.resumeFilePath}`} target="_blank" rel="noopener noreferrer">
												Xem CV
											</a>
										)}

									</div>
								</div>
							</div>
						</div>

					</div>
					<Tabs style={{ backgroundColor: '#fff' }}>
						<TabList className="tablist2">
							<Tab className={`tab-item ${tabIndex2 === 0 ? 'active' : ''}`} onClick={() => setTabIndex2(0)}>Tiếp tục</Tab>
							{mode === 'edit' && (
								<Tab className={`tab-item ${tabIndex2 === 1 ? 'active' : ''}`} onClick={() => setTabIndex2(1)}>Thông tin tuyển dụng</Tab>
							)}
						</TabList>

						<TabPanel>
							<div className='container-grid'>
								<div className="form-grid grid-item">
									<label id='a'>KỸ NĂNG</label>
									{skillNames.map((skillName, index) => {
										const skill = candidateData.skills.find(s => s.skillName.id === skillName.id);
										return (
											<div key={index} className="skill-experience-item">
												<label>{skillName.name}</label>
												<progress value={skill?.rating || 0} max="100" />
												<div className='skill-experience-input'>

													<input type="number" min="0" max="100" value={skill?.rating || ''} onChange={e => {
														let newSkills = [...candidateData.skills];
														if (skill) {
															newSkills = newSkills.map(s => s.skillName.id === skillName.id ? { ...s, rating: e.target.value } : s);
														} else {
															newSkills.push({ skillName: { id: skillName.id }, rating: e.target.value });
														}
														setCandidateData(prevState => ({ ...prevState, skills: newSkills }));
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
										const experience = candidateData.experiences.find(s => s.experienceName.id === experienceName.id);
										return (
											<div key={index} className="skill-experience-item">
												<label>{experienceName.name}</label>
												<progress value={experience?.rating || 0} max="100" />
												<div className='skill-experience-input'>
													<input type="number" min="0" max="100" value={experience?.rating || ''} onChange={e => {
														let newSkills = [...candidateData.experiences];
														if (experience) {
															newSkills = newSkills.map(s => s.experienceName.id === experienceName.id ? { ...s, rating: e.target.value } : s);
														} else {
															newSkills.push({ experienceName: { id: experienceName.id }, rating: e.target.value });
														}
														setCandidateData(prevState => ({ ...prevState, experiences: newSkills }));
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
									<label>Thông tin phỏng vấn</label>
									<div className="interview-item">
										<div className="interview-row first">
											<p>Phỏng vấn</p>
											<label>Thời gian</label>
											<label>Trạng thái</label>
										</div>
										<div className="interview-row second">
											<p>Phỏng vấn lần 1</p>
											<p>{candidateData.interviewTime || 'Chưa cập nhật'}</p>
											<p>{candidateData.firstInterviewStatus || 'Chưa cập nhật'}</p>
										</div>
										<div className="interview-row third">
											<p>Phỏng vấn lần 2</p>
											<p>{candidateData.secondInterviewTime || 'Chưa cập nhật'}</p>
											<p>{candidateData.secondInterviewStatus || 'Chưa cập nhật'}</p>
										</div>
									</div>
								</div>
								<div className="form-grid grid-item">
									<label>Thông tin hợp đồng</label>
									{candidateData.jobOffer ? (
										<>
											<br />
											<div className="info-row">
												<label>Ngày bắt đầu</label>
												<p>{candidateData.jobOffer.startDate || 'Chưa cập nhật'}</p>
											</div>
											<div className="info-row">
												<label>Ngày kết thúc</label>
												<p>{candidateData.jobOffer.endDate || 'Chưa cập nhật'}</p>
											</div>
											<div className="info-row">
												<label>Lương hàng tháng</label>
												<p>{candidateData.jobOffer.monthlySalary || 'Chưa cập nhật'}</p>
											</div>
											<div>
												<label>Ghi chú hợp đồng</label>
												<p>{candidateData.jobOffer.noteContract || 'Chưa cập nhật'}</p>
											</div>
										</>

									) : (
										<p>Chưa có thông tin hợp đồng</p>
									)}
								</div>
							</div>
						</TabPanel>
					</Tabs>
				</Tabs>
			</form >
		</>
	);
};

export default CandidateForm;
