import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './sidebar.css'
import { TbBrand4Chan } from "react-icons/tb";
import { FaUserAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Menu } from '../menu/Menu';
import { Modal } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {

  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleOpenResetDialog = () => {
    setOpenResetDialog(true);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  }

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  }

  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false);
  }

  const handleOpenEmailDialog = () => {
    setOpenEmailDialog(true)
  }

  const handleChangeEmail = async () => {
    const token = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}/change-email`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                newEmail
            })
        });

        const data = await response.json();

        if (response.status === 200) {
            toast.success(data.message);
            handleCloseEmailDialog();
        } else if (response.status === 400) {
            toast.error(data.message);
        } else if (response.status === 401) {
            toast.error(data.message);
        } else {
            toast.error("Có lỗi xảy ra khi thay đổi email");
        }
    } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra khi thay đổi email");
    }
}

  const handleChangePassword = async () => {
    const token = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    // const email = decodedToken.email;
    try {
      const response = await fetch(`http://localhost:8080/users/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      const data = await response.text();

      if (response.ok) {
        toast.success(data)
        handleCloseResetDialog();
      } else {
        toast.error(data)
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thay đổi mật khẩu');
    }
  }

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate("/");
  }

  return (
    <div className='sidebar'>
      <ToastContainer />
      <div className="left-sidebar">
        <a href="/hrm/dashboard" className='dashboard-logo'><TbBrand4Chan className='logo' /></a>
        <div className="left-sidebar-item">
          <div className="dropdown">
            {/* <span><IoSettings className='navbar-link icon setting' /></span> */}
            {/* <a href="/hrm/chat"><IoChatbubbleEllipsesOutline className='navbar-link icon chat'/></a> */}
            <span onClick={toggleUserMenu}><FaUserAlt className='navbar-link icon user' /></span>
            {isUserMenuOpen && (
              <div className={`user-menu ${isMenuOpen ? 'menu-open' : ''}`}>
                <button onClick={handleOpenEmailDialog}>Đổi email</button>
                <button onClick={handleOpenResetDialog}>Đổi mật khẩu</button>

                <button onClick={logout}>Đăng xuất</button>
              </div>
            )}
            <Modal
              open={openEmailDialog}
              onClose={handleCloseEmailDialog}
              aria-labelledby="email-modal-title"
              aria-describedby="email-modal-description" >
              <div className='user-form form-box'>
              <h4 id="email-modal-title">Đổi email</h4>
                <br />
                <label>Nhập mật khẩu</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className='form-control' />
                <label>Nhập email mới</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email mới" className='form-control' />
                <div className="btn-control">
                  <button className='btn-close' onClick={handleCloseEmailDialog}>Đóng</button>
                  <button onClick={handleChangeEmail} className='btn-save'>Gửi yêu cầu</button>
                </div>
              </div>
            </Modal>
            <Modal
              open={openResetDialog}
              onClose={handleCloseResetDialog}
              aria-labelledby="reset-modal-title"
              aria-describedby="reset-modal-description"
            >
              <div className='user-form form-box'>
              <h4 id="reset-modal-title">Đổi mật khẩu</h4>
                <br />
                <label>Nhập mật khẩu cũ</label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Mật khẩu cũ" className='form-control' />
                <label>Nhập mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" className='form-control' />
                <div className="btn-control">
                  <button className='btn-close' onClick={handleCloseResetDialog}>Đóng</button>
                  <button onClick={handleChangePassword} className='btn-save'>Gửi yêu cầu</button>
                </div>
              </div>
            </Modal>
            <span onClick={toggleMenu}><IoMenu className='navbar-link icon menu-toggle' /></span>
          </div>
        </div>
      </div>
      <Menu isMenuOpen={isMenuOpen} />

    </div>
  )
}
