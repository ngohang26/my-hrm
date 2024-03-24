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
  const [selectedDate, setSelectedDate] = useState(new Date()); // thêm trạng thái này

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialAttendances = await fetchAttendances();
      setAttendances(initialAttendances);
    }

    fetchInitialData();
  }, []);

  // Lọc dữ liệu chấm công dựa trên ngày được chọn
  const filteredAttendances = attendances.filter(attendance => {
    const attendanceDate = new Date(attendance.date);
    return attendanceDate.getDate() === selectedDate.getDate() &&
      attendanceDate.getMonth() === selectedDate.getMonth() &&
      attendanceDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <div>
      {/* Thêm một input để chọn ngày */}
      <input type="date" value={selectedDate.toISOString().substr(0, 10)} onChange={e => setSelectedDate(new Date(e.target.value))} />

      <DataTable columns={attendanceColumns} data={filteredAttendances} slug="attendance" showEditColumn={false}/>;
    </div>

  
    // <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
    //   <TabList className='tablist'>
    //     {/* <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Bộ phận</Tab>
    //     <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>Chức vụ</Tab>       */}
    //   </TabList>

    //   <TabPanel>
    //     <div className='attendances'>
    //     <div className='info'>
    //     </div>
    //     <DataTable columns={attendanceColumns} data={attendances} slug="attendance" showEditColumn={false}/>;

    //     </div>
    //   </TabPanel>

    //   <TabPanel>
    //   </TabPanel>
    //   </Tabs>

  );
}
export default Attendance