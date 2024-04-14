import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PaySlip = () => {
  const [setEmployeeSalaryDetails] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [employeeCode, setEmployeeCode] = useState(2403001);
  const [employeeSalary, setEmployeeSalary] = useState({});
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
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const token = localStorage.getItem('accessToken');

  async function fetchEmployeeSalaryDetails(employeeCode, year, month) {
    try {
      const response = await fetch(`http://localhost:8080/employeeSalary/salaryDetails/${employeeCode}/${year}/${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage); // Ném ra lỗi khi không thành công
      }
      return await response.json();
    } catch (error) {
      // Kiểm tra nếu có thông báo lỗi từ máy chủ thì hiển thị thông báo đó trên toast
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Có lỗi xảy ra khi tải dữ liệu từ máy chủ.');
      }
      console.error('Error fetching data: ', error);
      throw error;
    }
  }


  const fetchData = () => {
    fetchEmployeeSalaryDetails(employeeCode, year, month)
      .then(data => {
        setEmployeeSalary(data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = () => {
    fetchData();
  };
 
  function formatCurrency(amount) {
    if (amount === undefined) {
      return '';
    }
    
    const formattedAmount = amount.toLocaleString('vi-VN',);
    const integerPart = formattedAmount.split(',')[0];
    return integerPart;
  }
  
  
  return (
    <div>
      <ToastContainer />
      <input type="text" value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} placeholder="Nhập ID nhân viên" />
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
      <button onClick={fetchData}>Submit</button>
      <Card>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            PHIẾU CHI TIẾT LƯƠNG
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Tháng {month} - Năm {year}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Họ và tên</TableCell>
                      <TableCell>{employeeSalary.employeeName ? employeeSalary.employeeName : 'Loading...'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Chức vụ</TableCell>
                      <TableCell>{employeeSalary.departmentName}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Các khoản thu nhập</b></TableCell>
                      <TableCell><b>Số tiền</b></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lương tháng</TableCell>
                      <TableCell>{formatCurrency(employeeSalary.monthlySalary)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lương tăng ca</TableCell>
                      <TableCell>{formatCurrency(employeeSalary.overTimeSalary)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><b>Các khoản phụ cấp</b></TableCell>
                    </TableRow>
                    {employeeSalary.allowances && Object.entries(employeeSalary.allowances).map(([allowanceName, allowanceAmount]) => (
                      <TableRow key={allowanceName}>
                        <TableCell>{allowanceName}</TableCell>
                        <TableCell>{allowanceAmount}</TableCell>
                      </TableRow>

                    ))}
                    <TableRow>
                      <TableCell>Tổng phụ cấp</TableCell>
                      <TableCell><b>{formatCurrency(employeeSalary.totalAllowance)}</b></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tổng thu nhập trước thuế</TableCell>
                      <TableCell><b>{formatCurrency(employeeSalary.totalIncome)}</b></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><b>Thực lãnh</b></TableCell>
                      <TableCell><b>{formatCurrency(employeeSalary.netSalary)}</b></TableCell>
                      {/* <TableCell>{employeeSalary.netSalary}</TableCell> */}
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Mã nhân viên</TableCell>
                      <TableCell>{employeeSalary.employeeCode}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Công chuẩn</TableCell>
                      <TableCell>26 ngày</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tổng công</TableCell>
                      <TableCell>{employeeSalary.workingDaysInMonth}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><b>Các khoản khấu trừ</b></TableCell>
                      <TableCell><b>Số tiền</b></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phí BHXH, BHYT, BHTN</TableCell>
                      <TableCell>{formatCurrency(employeeSalary.totalInsurance)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Thuế TNCN</TableCell>
                      <TableCell>{formatCurrency(employeeSalary.incomeTax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Các khoản trừ</TableCell>
                      <TableCell><b>{formatCurrency(employeeSalary.totalDeductions)}</b></TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>

  )
}

export default PaySlip