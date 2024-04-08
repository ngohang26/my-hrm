import React, { useState, useEffect } from 'react'
import DataTable from '../../components/dataTable/DataTable'
import { CircularProgress, Box } from '@mui/material';
import './Payroll.css';

const payrollColumns = [
  { field: 'employeeCode', headerName: 'Mã nhân viên', flex: 2,},
  { field: 'employeeName', headerName: 'Tên nhân viên',flex: 3,},
  { field: 'positionName', headerName: 'Chức vụ', flex: 2.5,  },
  { field: 'netSalary', headerName: 'Lương', flex: 2.5,},
  // { field: '', headerName: 'Trạng tháưi', flex: 2.5,},
  // { field: '', headerName: 'Hoạt động', flex: 2,},  

];

async function fetchPayroll(year, month) {
  const response = await fetch(`http://localhost:8080/employeeSalary/allSalaryDetails/${year}/${month}`);
  return await response.json();
}

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1; // getMonth() trả về từ 0 (tháng 1) đến 11 (tháng 12)
  let currentYear = currentDate.getFullYear();

  let prevMonth, prevYear;
  if (currentMonth === 1) {
    prevMonth = 12;
    prevYear = currentYear - 1;
  } else {
    prevMonth = currentMonth - 1;
    prevYear = currentYear;
  }

  const [year, setYear] = useState(prevYear);  
  const [month, setMonth] = useState(prevMonth); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  //   useEffect(() => {
  //   const fetchInitialData = async () => {
  //     const initialAttendances = await fetchPayroll();
  //     setPayroll(initialAttendances);
  //   }

  //   fetchInitialData();
  // }, [year, month]);

  useEffect(() => {
    setLoading(true);  
    fetchPayroll(year, month)
      .then(data => {
        setPayroll(data);
        setLoading(false);  
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setLoading(false);  
      });
  }, [year, month]);

  const handleEdit = () => {}

  const years = Array.from({length: 50}, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <div>
      <select value={year} onChange={e => setYear(Number(e.target.value))}>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <select value={month} onChange={e => setMonth(Number(e.target.value))}>
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      {loading ? (
      <div className="root">
        <CircularProgress />
      </div>
    ) : (
      <DataTable columns={payrollColumns} data={payroll} slug="employeeSalary" onEdit={handleEdit} showEditColumn={true}/>
    )}
    </div>
  )
}

export default Payroll
