import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ mode, currentEmployee }) => {
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

    useEffect(() => {
        if (mode === 'edit' && currentEmployee) {
            setEmployeeData(currentEmployee);
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
    
        // Nếu có đường dẫn con
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

        if (mode === 'add') {
            fetch('http://localhost:8080/employees/addEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeToSend),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else if (mode === 'edit') {
            fetch(`http://localhost:8080/employees/${employeeToSend.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeToSend),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <input type="file" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', zIndex: 1 }} />
                {selectedFile ? <img src={URL.createObjectURL(selectedFile)} alt="Preview" width="100px" height="100px" /> : <img src={defaultImage} alt="Default" width="100px" height="100px" />}
            </label>
            <label>
                Full Name:
                <input type="text" value={employeeData.fullName} name="fullName" onChange={handleChange} />
            </label>
            <label>
                Phone Number:
                <input type="text" name="phoneNumber" value={employeeData.phoneNumber} onChange={handleChange} />
            </label>
            <label>
                CMND:
                <input type="text" name="personalInfo.identityCardNumber" value={employeeData.personalInfo.identityCardNumber} onChange={handleChange} />
            </label>
            <label>
                Work Email:
                <input type="email" name="workEmail" value={employeeData.workEmail} onChange={handleChange} />
            </label>
            <label>
                Position Name:
                <input type="text" name="positionName" value={employeeData.positionName} onChange={handleChange} />
            </label>
            <label>
                Department Name:
                <input type="text" name="departmentName" value={employeeData.departmentName} onChange={handleChange} />
            </label>
            <label>
                Nationality:
                <input type="text" name="personalInfo.nationality" value={employeeData.personalInfo.nationality} onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default EmployeeForm;
