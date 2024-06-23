import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import { CircularProgress, Box } from '@mui/material';
import './Payroll.css';
import { apiUrl } from '../../config'
import { Helmet, HelmetProvider } from 'react-helmet-async';

const payrollColumns = [
  { field: 'employeeCode', headerName: 'Mã nhân viên', flex: 2 },
  {
    field: 'employee', headerName: 'Chức vụ', flex: 2.5,
    valueGetter: (params) => params.row.employee.fullName,

  },
  { field: 'positionName', headerName: 'Tên nhân viên', flex: 3 },
  { field: 'netSalary', headerName: 'Lương', flex: 2.5 },
  { field: 'totalOvertimeHours', headerName: 'Giờ làm thêm', flex: 1.5 },
];

async function fetchPayroll(year, month) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${apiUrl}/employeeSalary/allSalaryRecords/${year}/${month}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

function formatCurrency(value) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).split(',')[0];
}

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPayroll(year, month)
      .then(data => {
        setPayroll(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  }, [year, month]);

  return (
    <HelmetProvider>
      <div className='pay-slip'>
        <Helmet>
          <title>Bảng lương</title>
        </Helmet>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className='input-control'>
          {Array.from({ length: 50 }, (_, i) => (
            <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className='input-control'>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        {loading ? (
          <div className="root">
            <CircularProgress />
          </div>
        ) : (
          <DataTable
            columns={payrollColumns}
            data={payroll.map(item => ({ ...item, netSalary: formatCurrency(item.netSalary) }))}
            slug="employeeSalary"
            showEditColumn={true}
          />
        )}
      </div>
    </HelmetProvider>
  );
};

export default Payroll;
