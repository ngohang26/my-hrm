import React, { useState, useEffect } from 'react'
import DataTable from '../../components/dataTable/DataTable.jsx'
import './Users.css'
import './AddUser.css'

import { MdOutlineSettings, MdLockReset } from 'react-icons/md'
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AddUser from './AddUser.jsx';
import { Modal } from '@mui/material';
import PermissionTable from '../../components/Add/PermissionTable.jsx';

const getImageUrl = (image) => {
  return `http://localhost:8080/api/FileUpload/files/${image}`;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);
  const [resetEmail, setResetEmail] = useState('');
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const permissionMap = {
    "EMPLOYEE": { "VIEW": 1, "ADD": 2, "EDIT": 3, "DELETE": 4 },
    "DEPARTMENT": { "VIEW": 5, "ADD": 6, "EDIT": 7, "DELETE": 8 },
    "POSITION": { "VIEW": 9, "ADD": 10, "EDIT": 11, "DELETE": 12 },
    "ATTENDANCE": { "VIEW": 13, "ADD": 14, "EDIT": 15, "DELETE": 16 },
    "ALLOWANCE": { "VIEW": 17, "ADD": 18, "EDIT": 19, "DELETE": 20 },
    "SALARY": { "VIEW": 21, "ADD": 22, "EDIT": 23, "DELETE": 24 },
    "CONTRACT": { "VIEW": 25, "ADD": 26, "EDIT": 27, "DELETE": 28 },
    "USER": { "VIEW": 29, "ADD": 30, "EDIT": 31, "DELETE": 32 },
  };

  const modules = Object.keys(permissionMap);
  const permissions = ["VIEW", "ADD", "EDIT", "DELETE"];

  const handleCheckboxChange = (module, permission) => {
    setSelectedUserPermissions(prevState => {
      let updatedPermissions;
      const existingPermission = prevState.find(p => p.module === module && p.permission === permission);
      if (existingPermission) {
        updatedPermissions = prevState.filter(p => p !== existingPermission);
      } else {
        updatedPermissions = [...prevState, { module, permission }];
      }
      return updatedPermissions;
    });
  };

  const handleEditPermissions = async (userId) => {
    setSelectedUserId(userId);
    setOpenModal(true);
    await fetchUserPermissions(userId);
  };

  const fetchUserPermissions = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:8080/users/${id}/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const permissionsFromApi = await response.json();
        setSelectedUserPermissions(permissionsFromApi);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };
  const handleSavePermissions = async (id, newPermissions) => {
    const token = localStorage.getItem('accessToken');

    // Convert newPermissions to an array of permission IDs
    const permissionIds = newPermissions.map(p => permissionMap[p.module][p.permission]);

    try {
      const response = await fetch(`http://localhost:8080/users/${id}/change-permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(permissionIds)
      });

      if (response.ok) {
        console.ok("thay đổi thành công")
        // Fetch updated permissions
        await fetchUserPermissions(id);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  }




  const handleShowResetDialog = (userId) => {
    setOpenModal(true);

    setSelectedUserId(userId);
    setOpenResetDialog(true);
  };

  const handleResetPassword = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:8080/users/${selectedUserId}/reset-password-for-admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(resetEmail)
      });

      if (response.ok) {
        console.log('thay đổi thành công');
        setOpenResetDialog(false);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi email reset mật khẩu:', error);
    }
  };
  const tableColumns = [
    {
      field: 'image',
      headerName: 'Avatar',
      renderCell: (params) => (
        <img src={getImageUrl(params.row.image)} alt="Avatar" style={{ width: '40px', height: '40px' }} />
      ),
      flex: 0.6,
    },
    { field: 'username', headerName: 'MÃ NHÂN VIÊN', flex: 1 },
    { field: 'fullName', headerName: 'TÊN NHÂN VIÊN', flex: 1.4 },
    { field: 'positionName', headerName: 'CHỨC VỤ', flex: 1 },
    { field: 'name', headerName: 'Role', flex: 1 },
    {
      field: 'detail',
      headerName: 'Hành động',
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleEditPermissions(params.row.id)} className='btn-action'>
            <MdOutlineSettings color='#000' title='Sửa quuyền' />
          </button>
          <button onClick={() => handleShowResetDialog(params.row.id)} className='btn-action'>
            <MdLockReset color='#000' title='Lấy mật khẩu' />
          </button>
        </div>
      ),
      flex: 1
    },
  ];

  const handleUserAdded = async () => {
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
    setTabIndex(0);
  };

  async function fetchUsers() {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8080/users/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();

  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialUsers = await fetchUsers();
      setUsers(initialUsers);
    };

    fetchInitialData();
  }, []);


  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Người dùng</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>Thêm</Tab>
      </TabList>
      <TabPanel>
        <div className='user-container'>
          <DataTable columns={tableColumns} data={users} slug="user" />;
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className='user-form change-permit'>
              <h4>Bảng quyền</h4>
              <PermissionTable
                permissionMap={permissionMap}
                modules={modules}
                permissions={permissions}
                selectedUserPermissions={selectedUserPermissions}
                handleCheckboxChange={handleCheckboxChange}
              />

              <div className="btn-control">
                <button className='btn-close' onClick={() => setOpenModal(false)}>Đóng</button>
                <button className='btn-save' onClick={() => handleSavePermissions(selectedUserId, selectedUserPermissions)}>Lưu</button>
              </div>
            </div>


          </Modal>
          <Modal
            open={openResetDialog}
            onClose={() => setOpenResetDialog(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className='user-form reset-password'>
              <h4>Reset mật khẩu</h4>
              <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Email" className='form-control' />
              <div className="btn-control">
                <button className='btn-close' onClick={() => setOpenModal(false)}>Đóng</button>
                <button onClick={handleResetPassword} className='btn-save'>Gửi yêu cầu</button>
              </div>
            </div>
          </Modal>
        </div>
      </TabPanel>
      <TabPanel>
        <AddUser onUserAdded={handleUserAdded} />
      </TabPanel>
    </Tabs>
  )
}

export default Users