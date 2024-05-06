import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './CandidateForm.css'
import { CircularProgress } from '@mui/material';
const CandidateForm = ({ mode, currentCandidate, setTabIndex, setShowEditTab, jobPositions, fetchCandidates, selectedJobPositionId, setSelectedJobPositionId }) => {
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState();

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
		experiences: []
	});
	const [tabIndex2, setTabIndex2] = useState(0);

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
				experiences: []
			});
		}
	}, [currentCandidate, mode]);

	const addSkill = () => {
		setCandidateData(prevState => ({
			...prevState,
			skills: [...prevState.skills, { name: '', proficiency: '' }]
		}));
	};

	const handleSkillChange = (e, index) => {
		const { value } = e.target;
		setCandidateData(prevState => ({
			...prevState,
			skills: prevState.skills.map((skill, i) =>
				i === index ? { ...skill, name: value } : skill
			)
		}));
	};

	const handleSkillProficiencyChange = (e, index) => {
		const { value } = e.target;
		setCandidateData(prevState => ({
			...prevState,
			skills: prevState.skills.map((skill, i) =>
				i === index ? { ...skill, proficiency: value } : skill
			)
		}));
	};

	const removeSkill = (index) => {
		setCandidateData(prevState => ({
			...prevState,
			skills: prevState.skills.filter((_, i) => i !== index)
		}));
	};

	const addExperience = () => {
		setCandidateData(prevState => ({
			...prevState,
			experiences: [...prevState.experiences, { jobTitle: '', company: '', startDate: '', endDate: '' }]
		}));
	};

	const handleExperienceChange = (e, index) => {
		const { value } = e.target;
		setCandidateData(prevState => ({
			...prevState,
			experiences: prevState.experiences.map((experience, i) =>
				i === index ? { ...experience, jobTitle: value } : experience
			)
		}));
	};

	const handleExperienceCompanyChange = (e, index) => {
		const { value } = e.target;
		setCandidateData(prevState => ({
			...prevState,
			experiences: prevState.experiences.map((experience, i) =>
				i === index ? { ...experience, company: value } : experience
			)
		}));
	};

	const handleExperienceStartDateChange = (e, index) => {
		const { value } = e.target;
		setCandidateData(prevState => ({
			...prevState,
			experiences: prevState.experiences.map((experience, i) =>
				i === index ? { ...experience, startDate: value } : experience
			)
		}));
	};

	const handleExperienceEndDateChange = (e, index) => {
		const { value } = e.target;
		setCandidateData(prevState => ({
			...prevState,
			experiences: prevState.experiences.map((experience, i) =>
				i === index ? { ...experience, endDate: value } : experience
			)
		}));
	};

	const removeExperience = (index) => {
		setCandidateData(prevState => ({
			...prevState,
			experiences: prevState.experiences.filter((_, i) => i !== index)
		}));
	};
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
    if (file) {
        await handleUpload(file);
    }
};

const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:8080/api/FileUpload/uploadResume', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData,
    });
		if (response.ok) {
			const data = await response.json();
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

		if (selectedFile instanceof File) {
			resumeFilePath = await handleUpload(selectedFile);
		} else {
			console.log("No file selected or user did not choose to update the resume.");
		}
		setLoading(true)
		const candidateToSend = {
			...candidateData,
			resumeFilePath: resumeFilePath,
			jobPosition: { id: selectedJobPositionId }
		};


		console.log("Data sent to server:", candidateToSend);
		const token = localStorage.getItem('accessToken');

		try {
			let response;
			if (mode === 'add') {
				response = await fetch('http://localhost:8080/candidates/addCandidate', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(candidateToSend),
				});
			} else if (mode === 'edit') {
				response = await fetch(`http://localhost:8080/candidates/update/${candidateToSend.id}`, {
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
									<input type="text" name="candidateName" id='candidateName' value={candidateData.candidateName} placeholder='Họ và tên' onChange={handleChange} className='form-control more' />
								</div>
								<div>
									<select name="jobPositionName" value={selectedJobPositionId} onChange={handleJobPositionChange} className='form-control select' >
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
										<input type="file" id="cvUpload" onChange={handleFileChange} className='form-control more' style={{marginTop: '0px'}} />
									</div>
								</div>
							</div>
						</div>

					</div>
					<Tabs style={{ backgroundColor: '#fff' }}>
						<TabList className="tablist2">
							<Tab className={`tab-item ${tabIndex2 === 0 ? 'active' : ''}`} onClick={() => setTabIndex2(0)}>Tiếp tục</Tab>
							<Tab className={`tab-item ${tabIndex2 === 1 ? 'active' : ''}`} onClick={() => setTabIndex2(1)}>Thông tin công việc</Tab>
						</TabList>
						<TabPanel>
							<div className='container-grid'>
								<div className="form-grid grid-item">
									<label>KỸ NĂNG</label>
									{candidateData.skills.map((skill, index) => (
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
											<button type='button' onClick={() => removeSkill(index)}>Remove</button>
										</div>
									))}
									<button type='button' onClick={addSkill}>Add Skill</button>
								</div>

								<div className="form-grid grid-item">
									<label>KINH NGHIỆM</label>
									{candidateData.experiences.map((experience, index) => (
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
											<button type='button' onClick={() => removeExperience(index)}>Remove</button>
										</div>
									))}
									<button type='button' onClick={addExperience}>Add Experience</button>
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
