import React, { useState } from 'react'
import './AddUser.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PermissionTable from '../../components/Add/PermissionTable';

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

const roleMap = {
  "SUPER": 1,
  "ACCOUNTANT": 2,
  "EMPLOYEE": 3
};

const AddUser = ({ onUserAdded }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);

  const token = localStorage.getItem('accessToken');

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

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Convert selectedUserPermissions to an array of permission IDs
      const permissionIds = selectedUserPermissions.map(p => permissionMap[p.module][p.permission]);

      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          roleId: roleId,
          permissionIds: permissionIds
        }),
      });
      if (response.ok) {
        toast.success('Thêm người dùng thành công');
        setTimeout(onUserAdded, 1000);
      } else if (response.status === 409) {
        toast.error('Người dùng đã tồn tại');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Thêm người dùng không thành công:', error);
    }
  }

  const handleRoleChange = (event) => {
    setRoleId(roleMap[event.target.value]);
    setRoleName(event.target.value);
  };
  return (
    <div className='user-form'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Tên người dùng</label>
          <input type="text" className='form-control' value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input type="password" className='form-control' value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" className='form-control' value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        </div>

        <div className="input-group">
          <label>Chọn vai trò</label>
          <select value={roleName} onChange={handleRoleChange} className='form-control'>
            <option value="">Select a role</option>
            {Object.keys(roleMap).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <h4 style={{ marginTop: '30px' }}>Phân quyền</h4>
        {selectedUserPermissions && (
          <PermissionTable
            permissionMap={permissionMap}
            modules={modules}
            permissions={permissions}
            selectedUserPermissions={selectedUserPermissions}  
            handleCheckboxChange={handleCheckboxChange}
          />
        )}

        <div style={{ width: "100%" }}>
          <button type="submit" className='btn-submit'>Thêm</button>
        </div>
      </form>
    </div>
  )


}

export default AddUser