import React from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import { useState, useEffect, useContext } from 'react';
import './Attendance.css'
import { Modal } from '@mui/material';
import { FiEdit } from 'react-icons/fi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PermissionContext from '../../Auth/PermissionContext';
import { apiUrl } from '../../config'

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const permissions = useContext(PermissionContext);
  const userHasEditPermission = permissions.includes('EDIT_ATTENDANCE');

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialAttendances = await fetchAttendances();
      setAttendances(initialAttendances);
    }

    fetchInitialData();
  }, [selectedMonth]);

  async function fetchAttendances() {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${apiUrl}/attendances/getAllAttendances`, {
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
    } else if (filterType === 'all') {
      return true;
    }
    return false;
  });


  const handleEditTime = (attendance) => {
    setEditingAttendance(attendance);
    setOpenEditDialog(true);
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  }

  const handleUpdateTime = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiUrl}/attendances/update/${editingAttendance.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          timeIn: editingAttendance.timeIn,
          timeOut: editingAttendance.timeOut
        })
      });
      if (!response.ok) {
        const data = await response.text();
        toast.error(data);
        throw new Error('Lỗi cập nhật thời gian chấm công');
      }
      const updatedAttendance = await response.json();
      setOpenEditDialog(false);
      setAttendances(attendances.map(a => a.id === updatedAttendance.id ? updatedAttendance : a));
      toast.success("Thay đổi thời gian chấm công thành công!")
    } catch (error) {
      console.error('Lỗi cập nhật thời gian chấm công', error);
    }
  };

  const attendanceColumns = [
    { field: 'employeeCode', headerName: 'Mã nhân viên', flex: 2, },
    { field: 'employeeName', headerName: 'Tên nhân viên', flex: 3, },
    { field: 'date', headerName: 'Ngày', flex: 2.5, },
    { field: 'timeIn', headerName: 'Giờ vào', flex: 2.5, },
    { field: 'timeOut', headerName: 'Giờ ra', flex: 2.5, },
    { field: 'workTime', headerName: 'Giờ làm việc', flex: 2, },
  ];
  if (userHasEditPermission) {
    attendanceColumns.push({
      field: 'actions',
      headerName: 'Hành động',
      flex: 1.5,
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleEditTime(params.row)} className='btn-action'>
            <FiEdit color='#000' />
          </button>
        </div>
      ),
    });
  }
  return (
    <div className='attendance'>
      <ToastContainer />
      <div className="attendance-header">
        <div>
          <select name="" id="" value={filterType} onChange={(e) => setFilterType(e.target.value)} className='input-control'>
            <option>Chọn kiểu ...</option>
            <option value="day">Ngay</option>
            <option value="month">Thang</option>
          </select>
          {filterType === 'day' ? <input type="date" onChange={(e) => setDateFilter(new Date(e.target.value))} className='input-control' />
            : <input type="month" value={selectedMonth ? selectedMonth.toISOString().substr(0, 7) : ''} onChange={e => setSelectedMonth(new Date(e.target.value))} className='input-control' />

          }



        </div>
        <button onClick={() => { setFilterType('all'); setDateFilter(new Date()); setSelectedMonth(null); }} className='btn-submit'>Hiển thị tất cả</button>
      </div>

      <DataTable columns={attendanceColumns} data={filteredAttendances} slug="attendance" />;
      <Modal
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className='user-form form-box'>
          <h4>Chỉnh sửa thời gian chấm công</h4>
          <br />
          <label>Thời gian vào</label>
          <input type="time" value={editingAttendance?.timeIn} onChange={e => setEditingAttendance({ ...editingAttendance, timeIn: e.target.value })} className='form-control' />
          <label>Thời gian ra</label>
          <input type="time" value={editingAttendance?.timeOut} onChange={e => setEditingAttendance({ ...editingAttendance, timeOut: e.target.value })} className='form-control' />
          <div className="btn-control">
            <button className='btn-close' onClick={handleCloseEditDialog}>Đóng</button>
            <button onClick={handleUpdateTime} className='btn-save'>Cập nhật</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Attendance