import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import './Attendance.css'
const attendanceColumns = [
  { field: 'employeeCode', headerName: 'Mã nhân viên', flex: 2,},
  { field: 'employeeName', headerName: 'Tên nhân viên',flex: 3,},
  { field: 'date', headerName: 'Ngày', flex: 2.5,  },
  { field: 'timeIn', headerName: 'Giờ vào', flex: 2.5,},
  { field: 'timeOut', headerName: 'Giờ ra', flex: 2.5,},
  { field: 'workTime', headerName: 'Giờ làm việc', flex: 2,},  

];

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [filterType, setFilterType] = useState('day');
  const [dateFilter, setDateFilter] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialAttendances = await fetchAttendances();
      setAttendances(initialAttendances);
    }
    
    fetchInitialData();
  }, [selectedMonth]);
  
  async function fetchAttendances() {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8080/attendances/getAllAttendances', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  }

const filteredAttendances = attendances.filter(attendance => {
  const attendanceDate = new Date(attendance.date);
  if (filterType === 'day') {
    return attendanceDate.toISOString().substr(0, 10) === dateFilter.toISOString().substr(0, 10);
  } else if (filterType === 'month') {
    return selectedMonth && attendanceDate.getMonth() === new Date(selectedMonth).getMonth() &&
      attendanceDate.getFullYear() === new Date(selectedMonth).getFullYear();
  }
  return true;
});

  return (
    <div className='attendance'>
      <div className="attendance-header">
        <div>
          <select name="" id="" onChange={(e) => setFilterType(e.target.value)} className='input-control'>
            <option value="day" selected >Ngay</option>
            <option value="month" >Thang</option>
          </select>
          { filterType === 'day' ? <input type="date" onChange={(e) => setDateFilter(new Date(e.target.value))} className='input-control'/>
          :<input type="month" value={selectedMonth ? selectedMonth.toISOString().substr(0, 7) : ''} onChange={e => setSelectedMonth(new Date(e.target.value))}  className='input-control'/>

          }
        </div>
        <button onClick={() => {setSelectedDate(null); setSelectedMonth(null);}} className='btn-submit'>Hiển thị tất cả</button>
      </div>

      <DataTable columns={attendanceColumns} data={filteredAttendances} slug="attendance" showEditColumn={false}/>;
    </div>
  );
}
export default Attendance