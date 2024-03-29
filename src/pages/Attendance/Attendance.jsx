import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
const attendanceColumns = [
  {
    field: 'employeeCode',
    headerName: 'Mã nhân viên',
    flex: 2,
  },
  {
    field: 'employeeName',
    headerName: 'Tên nhân viên',
    flex: 3,
  },
  {
    field: 'date',
    headerName: 'Ngày',
    flex: 2.5,
  },
  {
    field: 'timeIn',
    headerName: 'Giờ vào',
    flex: 2.5,
  },
  {
    field: 'timeOut',
    headerName: 'Giờ ra',
    flex: 2.5,
  },
  {
    field: 'workTime',
    headerName: 'Giờ làm việc',
    flex: 2,
  },  

];

async function fetchAttendances() {
  const response = await fetch('http://localhost:8080/attendances/getAllAttendances');
  return await response.json();
}

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // thay đổi giá trị mặc định này thành null

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialAttendances = await fetchAttendances();
      setAttendances(initialAttendances);
    }

    fetchInitialData();
  }, []);

  const filteredAttendances = selectedDate ? attendances.filter(attendance => {
    const attendanceDate = new Date(attendance.date);
    return attendanceDate.getDate() === selectedDate.getDate() &&
      attendanceDate.getMonth() === selectedDate.getMonth() &&
      attendanceDate.getFullYear() === selectedDate.getFullYear();
  }) : attendances;

  return (
    <div>
      {/* Thêm một input để chọn ngày */}
      <input type="date" value={selectedDate ? selectedDate.toISOString().substr(0, 10) : ''} onChange={e => setSelectedDate(new Date(e.target.value))} />

      {/* Thêm một nút để xóa lựa chọn ngày */}
      <button onClick={() => setSelectedDate(null)}>Hiển thị tất cả</button>

      <DataTable columns={attendanceColumns} data={filteredAttendances} slug="attendance" showEditColumn={false}/>;
    </div>
  );
}
export default Attendance