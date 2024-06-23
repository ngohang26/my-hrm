import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PaySlip.css'
import { apiUrl } from '../../config'
import { jwtDecode } from 'jwt-decode';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const PaySlip = () => {
  const [employeeCode, setEmployeeCode] = useState(null);
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
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsDisabled(!decodedToken.authorities.includes('ADD_SALARY'));
    }
  }, []);
  useEffect(() => {
    const decodedToken = jwtDecode(token);
    setEmployeeCode(decodedToken.username);
  }, [token]);

  async function fetchEmployeeSalaryDetails(employeeCode, year, month) {
    try {
      const response = await fetch(`${apiUrl}/employeeSalary/salaryRecordDetails/${employeeCode}/${year}/${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Có lỗi xảy ra khi tải dữ liệu từ máy chủ.');
      }
      console.error('Error fetching data: ', error);
      throw error;
    }
  }


  const fetchData = useCallback(() => {
    fetchEmployeeSalaryDetails(employeeCode, year, month)
      .then(data => {
        setEmployeeSalary(data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [employeeCode, year, month]);

  useEffect(() => {
    if (employeeCode !== null) {
      // fetchData();
    }
  }, [fetchData, employeeCode]);


  function formatCurrency(amount) {
    if (amount === undefined) {
      return '';
    }

    const formattedAmount = amount.toLocaleString('vi-VN',);
    const integerPart = formattedAmount.split(',')[0];
    return integerPart;
  }


  return (
    <HelmetProvider>
      <div className='pay-slip'>
        <Helmet>
          <title>Phiếu lương</title>
        </Helmet>
        <ToastContainer />
        <input type="text" value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} placeholder="Nhập ID nhân viên" className='input-control' disabled={isDisabled} />
        <select value={year} onChange={e => setYear(Number(e.target.value))} className='input-control' disabled={isDisabled}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className='input-control' disabled={isDisabled}>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <button onClick={fetchData} className='btn-view'>Xem</button>
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
                        <TableCell>{employeeSalary.employee ? employeeSalary.employee.fullName : 'Loading...'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Chức vụ</TableCell>
                        <TableCell>{employeeSalary ? employeeSalary.positionName : 'Loading...'}</TableCell>
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
    </HelmetProvider>

  )
}

export default PaySlip