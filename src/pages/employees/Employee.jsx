import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import EmployeeForm from './EmployeeForm';
import DataTable from '../../components/dataTable/DataTable';
import { apiUrl } from '../../config'
import { FiEdit } from 'react-icons/fi'
import { IoSettings } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import FormComponent from '../../components/Add/FormComponent';
import { MdOutlineSettings } from 'react-icons/md';
import { toast } from 'react-toastify';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [mode, setMode] = useState('add');
  const [showEditTab, setShowEditTab] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [reasonNameToId, setReasonNameToId] = useState([]);
  const [reasonEmployee, setReasonEmployee] = useState([])
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState();
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState(null);
  const [reasonId, setReasonId] = useState('');
  const [terminationDate, setTerminationDate] = useState('');
  useEffect(() => {
    fetchEmployees();
    fetchPositions();
    fetchDepartments();
    fetchReasonList();
  }, []);
  const token = localStorage.getItem('accessToken');

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEmployeeStatus = (employeeId) => {
    setEmployeeIdToUpdate(employeeId);
    setIsFormOpen(true);
  };
  const [editing, setEditing] = useState({});
  async function fetchUpdateStatus(employeeId, reasonDetails) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiUrl}/employees/${employeeId}/terminate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reasonDetails),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Cập nhật thành công');
        setIsFormOpen(false);
        toast.success('Cập nhật thành công');
      } else {
        console.error('Cập nhật không thành công');
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API cập nhật: ', error);
      toast.error('Đã xảy ra lỗi khi cập nhật');
    }
  }

  const fetchReasonList = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${apiUrl}/terminationReasons/getAllTerminationReason`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      const reasonList = await response.json();
      setReasonEmployee(reasonList);

      const reasonNameToId = {};
      for (let reason of reasonList) {
        reasonNameToId[reason.reason] = reason.id;
      }
      setReasonNameToId(reasonNameToId);
    } else {
      console.error('Failed to fetch reason list');
    }
  };

  const handleUpdateFormSubmit = async (data) => {
    const reasonId = data.reasonId;
    const terminationDate = data.terminationDate;
    const reasonDetails = {
      reasonId: reasonId,
      terminationDate: terminationDate,
    };

    await fetchUpdateStatus(employeeIdToUpdate, reasonDetails);
  };


  const handleEdit = (employee) => {
    setEditing(employee);
    setIsFormOpen(true);
  };

  const handleUpdateFormCancel = () => {
    setShowUpdateForm(false);
  };

  const fetchEmployees = async () => {

    try {
      const response = await fetch(`${apiUrl}/employees/getAllEmployeesActive`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${apiUrl}/positions/getAllPositions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${apiUrl}/departments/getAllDepartments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setSelectedPositionId(employee.position.id);
    setSelectedDepartmentId(employee.department.id);

    setMode('edit');
    setShowEditTab(true);
    setTabIndex(2);
  };
  const tableColumns = [
    {
      field: 'image',
      headerName: 'AVATAR',
      renderCell: (params) => (
        <img src={getImageUrl(params.row.image)} alt="Avatar" style={{ width: '40px', height: '40px' }} />
      ),
      flex: 0.6,
    },
    { field: 'employeeCode', headerName: 'MÃ NHÂN VIÊN', flex: 1 },
    { field: 'fullName', headerName: 'TÊN NHÂN VIÊN', flex: 1.3 },
    {
      field: 'position',
      headerName: 'CHỨC VỤ',
      flex: 1.1,
      valueGetter: (params) => params.row.position.positionName,
    },
    {
      field: 'department',
      headerName: 'PHÒNG BAN',
      flex: 1,
      valueGetter: (params) => params.row.department.departmentName,
    },
    { field: 'phoneNumber', headerName: 'PHONE NUMBER', flex: 1 },
    {
      field: 'edit',
      headerName: 'HÀNH ĐỘNG',
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleEmployeeStatus(params.row.id)} className='btn-action'>
            <MdOutlineSettings color='#000' title='Cập nhật tình trạng nhân viên' />
          </button>
          <button onClick={() => handleEditEmployee(params.row)} className='btn-action'>
            <FiEdit color='#000' title='Sửa thông tin nhân viên' />
          </button>
        </div>
      ),
      flex: 0.8,
    },
  ];

  const getImageUrl = (image) => {
    return `${apiUrl}/api/FileUpload/files/images/${image}`;
  };

  // index là tab muốn chuyển sang
  const handleTabSelect = (index) => {
    if (((tabIndex === 2 || tabIndex === 1) && index === 0) || (tabIndex === 2 && index === 1)) {
      const confirmLeave = window.confirm('Bạn có chắc chắn muốn rời đi mà không lưu?');
      if (!confirmLeave) {
        return;
      }
    }

    setTabIndex(index);

    if (index === 1 || index === 0) {
      setEditingEmployee(null);
      setMode('add');
      setShowEditTab(false);
    }
  };

  const [isReasonMenuOpen, setIsReasonMenuOpen] = useState(false);

  const toggleReasonMenu = () => {
    setIsReasonMenuOpen(!isReasonMenuOpen);
  }

  return (
    <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
      <TabList className='tablist tabemployee'>
        <div style={{ display: 'flex' }}>
          <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
          <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>+ Thêm</Tab>
          {showEditTab && (
            <Tab className={`tab-item ${tabIndex === 2 ? 'active' : ''}`} style={{ color: tabIndex === 2 ? '#5a5279' : 'gray' }}>Sửa</Tab>
          )}
        </div>
        <span onClick={toggleReasonMenu}><IoSettings className='navbar-link icon setting' /></span>
        {isReasonMenuOpen && (
          <div className='e-menu'>
            <Link to="/hrm/employee/termination-reasons">Lý do thôi việc</Link>
          </div>
        )}
      </TabList>
      <TabPanel>
        <DataTable columns={tableColumns} data={employees} />
        {isFormOpen && (
          <div className="overlay">
            <FormComponent fields={[
              {
                field: 'reasonId',
                headerName: 'Lý do thôi việc',
                options: reasonEmployee.map(reason => ({ id: reason.id, name: reason.reason })),
                type: 'select'
              },

              {
                field: 'terminationDate',
                headerName: 'Ngày thôi việc',
                type: 'date',
              },
            ]} onSubmit={handleUpdateFormSubmit} onCancel={() => setIsFormOpen(false)} initialValues={{ reasonId, terminationDate }} />
          </div>
        )}
      </TabPanel>
      <TabPanel>
        {mode === 'add' && <EmployeeForm mode={mode}
          setTabIndex={setTabIndex}
          positions={positions}
          departments={departments}
          fetchEmployees={fetchEmployees}
          selectedPositionId={selectedPositionId}
          selectedDepartmentId={selectedDepartmentId}
          setSelectedPositionId={setSelectedPositionId}
          setSelectedDepartmentId={setSelectedDepartmentId}
        />}
      </TabPanel>
      {showEditTab && (
        <TabPanel>
          {mode === 'edit' && editingEmployee && <EmployeeForm mode={mode}
            currentEmployee={editingEmployee}
            setTabIndex={setTabIndex}
            setShowEditTab={setShowEditTab}
            positions={positions}
            departments={departments}
            fetchEmployees={fetchEmployees}
            selectedPositionId={selectedPositionId}
            selectedDepartmentId={selectedDepartmentId}
            setSelectedPositionId={setSelectedPositionId}
            setSelectedDepartmentId={setSelectedDepartmentId}
          />}
        </TabPanel>
      )}
    </Tabs>
  );

};

export default Employee;
