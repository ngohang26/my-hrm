import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
const attendanceColumns = [
  { field: 'employeeCode', headerName: 'Mã nhân viên', flex: 2,},
  { field: 'employeeName', headerName: 'Tên nhân viên',flex: 3,},
  { field: 'date', headerName: 'Ngày', flex: 2.5,  },
  { field: 'timeIn', headerName: 'Giờ vào', flex: 2.5,},
  { field: 'timeOut', headerName: 'Giờ ra', flex: 2.5,},
  { field: 'workTime', headerName: 'Giờ làm việc', flex: 2,},  

];

async function fetchAttendances() {
  const response = await fetch('http://localhost:8080/attendances/getAllAttendances');
  return await response.json();
}

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

  const filteredAttendances = selectedMonth ? attendances.filter(attendance => {
    const attendanceDate = new Date(attendance.date);
    return attendanceDate.getMonth() === new Date(selectedMonth).getMonth() &&
      attendanceDate.getFullYear() === new Date(selectedMonth).getFullYear();
  }) : attendances;

  return (
    <div>
      <select name="" id="" onChange={(e) => setFilterType(e.target.value)}>
        <option value="day" selected >Ngay</option>
        <option value="month" >Thang</option>
      </select>
      { filterType === 'day' ? <input type="date" onChange={(e) => setDateFilter(new Date(e.target.value))} />
       :<input type="month" value={selectedMonth ? selectedMonth.toISOString().substr(0, 7) : ''} onChange={e => console.log(e.target.value)} />
      }
      <button onClick={() => {setSelectedDate(null); setSelectedMonth(null);}}>Hiển thị tất cả</button>

      <DataTable columns={attendanceColumns} data={filteredAttendances} slug="attendance" showEditColumn={false}/>;
    </div>
  );
}
export default Attendance