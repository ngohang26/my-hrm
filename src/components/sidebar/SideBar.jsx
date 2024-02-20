import React from 'react'
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
  return (
    <div className='sidebar'>
      <div className="left-sidebar">
        <a href="/" className=''><TbBrand4Chan className='logo'/></a>
        <div className="left-sidebar-item">

          <div className="dropdown">
            <a href="/"><FaSearch className='navbar-link icon search'/></a>
            <a href="/"><FaCalendarAlt className='navbar-link icon calendar'/></a>
            <a href="/"><MdOutlineContactEmergency className='navbar-link icon contact'/></a>
            <a href="/"><IoChatbubbleEllipsesOutline className='navbar-link icon chat'/></a>
            <a href="/"><FaRegFolder className='navbar-link icon file'/></a>
          </div>
          <div className="dropdown">
            <span><IoSettings className='navbar-link icon setting'/></span>
            <a href="/"><FaUserAlt className='navbar-link icon user'/></a>
            <span onClick={toggleMenu}><IoMenu className='navbar-link icon menu-toggle'/></span>
          </div>
        </div>
      </div>
      <Menu isMenuOpen={isMenuOpen} />

    </div>
  )
}
