import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FormComponent from '../../components/Add/FormComponent.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FiEdit,FiEye} from 'react-icons/fi'
import {apiUrl} from '../../config'

const contractColumns = [
  { field: 'contractCode', headerName: 'Mã hợp đồng', flex: 3},
  { field: 'employeeCode', headerName: 'Mã nhân viên', flex: 2,},
  { field: 'fullName', headerName: 'Tên nhân viên',flex: 3,},
  { field: 'positionName', headerName: 'Chức vụ', flex: 2.5,},
  { field: 'startDate', headerName: 'Ngày bắt đầu', flex: 2.5,  },
  { field: 'endDate', headerName: 'Ngày kết thúc', flex: 2.5,},
  {
    field: 'monthlySalary',
    headerName: 'Lương cơ bản',
    flex: 2,
    renderCell: (params) => (
      `${params.value.toLocaleString('vi-VN')} đ`
    ),
  },
  {
    field: 'detail',
    headerName: 'Hành động',
    renderCell: (params) => (
      <div style={{marginLeft: '10px'}}>
        <Link to={`/hrm/contracts/update/${params.row.employeeCode}`} style={{marginRight: '15px'}}>
        <FiEdit color='#000'/>
        </Link>
        <Link to={`/hrm/contracts/view/${params.row.employeeCode}`}>
        <FiEye color='#000'/>
      </Link>
      </div>
    ),
  },

];



async function fetchContracts() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${apiUrl}/employees/contracts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
}

async function fetchEmployeeCodes() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${apiUrl}/employees/employeeCodes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
}

const Contract = () => {
  const [contracts, setContracts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employeeCodeNames, setEmployeeCodeNames] = useState([]);                          
  const addContractColumns = [
    { 
      field: 'employeeCode', 
      headerName: 'Nhân viên', 
      type: 'select',
      options: employeeCodeNames.map(name => ({ id: name, name })),
    },
    { field: 'noteContract', headerName: 'Chú ý',},
    { field: 'signDate', headerName: 'Ngày ký', type: 'date' },
    { field: 'numberOfSignatures', headerName: 'Số lần ký',},  
    { field: 'startDate', headerName: 'Ngày bắt đầu', type: 'date' },
    { field: 'endDate', headerName: 'Ngày kết thúc', type: 'date' },
    { field: 'monthlySalary', headerName: 'Lương cơ bản',},
  
  ];

  const handleFormSubmit = (formData) => {
  const token = localStorage.getItem('accessToken');

    fetch(`${apiUrl}/employees/${formData.employeeCode}/contract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlySalary: formData.monthlySalary,
        numberOfSignatures: formData.numberOfSignatures,
        noteContract: formData.noteContract,
        signDate: formData.signDate
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Hợp đồng đã tồn tại cho nhân viên này');
      }
      return response.json();
    })
    .then(data => {
      setIsFormOpen(false);
      return fetchContracts();
    })
    .then(updatedContracts => {
      setContracts(updatedContracts);
    })
    .catch(error => {
      if (error.message === 'Hợp đồng đã tồn tại cho nhân viên này') {
        toast.error(error.message);  
        setIsFormOpen(false);  
      }
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialContracts = await fetchContracts();
      const initialEmployeeCodeNames = await fetchEmployeeCodes();  
      setContracts(initialContracts);
      setEmployeeCodeNames(initialEmployeeCodeNames); 
    }
  
    fetchInitialData();
  }, []);
  
  const openForm = () => {
    setIsFormOpen(true);
  }

  const closeForm = (event) => {
    if (event.target === event.currentTarget) {
      setIsFormOpen(false);
    }
  }
 
  return (
    <div>
      <ToastContainer/>
        <div className='info'>
          <button onClick={openForm} className='btn-add' onCalcel={closeForm}>+ Thêm</button>
        </div>
      <DataTable columns={contractColumns} data={contracts} slug="contract" showEditColumn={false} />;
      {isFormOpen && (
        <div className="overlay" onClick={closeForm}>
          <FormComponent fields={addContractColumns} onSubmit={handleFormSubmit} onCancel={closeForm} />
        </div>
      )}
 
    </div>
  );
}
export default Contract