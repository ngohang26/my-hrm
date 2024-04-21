import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './sidebar.css'
import { TbBrand4Chan } from "react-icons/tb";
import {FaSearch, FaCalendarAlt, FaUserAlt} from "react-icons/fa";
import { MdOutlineContactEmergency } from "react-icons/md";
import { IoChatbubbleEllipsesOutline, IoSettings, IoMenu} from "react-icons/io5";
import { FaRegFolder } from "react-icons/fa";
import { Menu } from '../menu/Menu';


export const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  }
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate("/");
  }

  return (
    <div className='sidebar'>
      <div className="left-sidebar">
        <a href="/dashboard" className=''><TbBrand4Chan className='logo'/></a>
        <div className="left-sidebar-item">

          <div className="dropdown">
            <a href="/x"><FaSearch className='navbar-link icon search'/></a>
            <a href="/x"><FaCalendarAlt className='navbar-link icon calendar'/></a>
            <a href="/x"><MdOutlineContactEmergency className='navbar-link icon contact'/></a>
            <a href="/x"><IoChatbubbleEllipsesOutline className='navbar-link icon chat'/></a>
            <a href="/x"><FaRegFolder className='navbar-link icon file'/></a>
          </div>
          <div className="dropdown">
        <span><IoSettings className='navbar-link icon setting'/></span>
        <span onClick={toggleUserMenu}><FaUserAlt className='navbar-link icon user'/></span>
        {isUserMenuOpen && (
          <div className="user-menu">
            <a href="/profile">Thông tin</a>
            <a href="/change-password">Đổi mật khẩu</a>
            <button onClick={logout}>Đăng xuất</button>
          </div>
        )}
        <span onClick={toggleMenu}><IoMenu className='navbar-link icon menu-toggle'/></span>
      </div>
        </div>
      </div>
      <Menu isMenuOpen={isMenuOpen} />

    </div>
  )
}
