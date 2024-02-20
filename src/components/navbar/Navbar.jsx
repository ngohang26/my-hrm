import React from 'react'
import './navbar.css'
import { useLocation } from 'react-router-dom';
import { MdOutlineArrowDropDown } from "react-icons/md";
import { IoIosMail, IoMdNotifications  } from "react-icons/io";
import { MoreButton } from '../morebuttons/MoreButton';
import {FaUser} from 'react-icons/fa'

export const Navbar = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  return (
    <div className='navbar'>  
      <div className="title">
        <h5>{pageName}</h5>
      </div>
      <div className="navbar-item">
        <div className="item language">
          <MoreButton
            label="Language"
            icon={MdOutlineArrowDropDown}
            items={[
              { label: 'English', icon: "us.svg", onClick: () => console.log('Using English') },
              { label: 'Vietnamese', icon: "vn.svg", onClick: () => console.log('Using Vietnamese') },
          ]}/>
        </div>
        <div className="item language">
          <MoreButton
            label="Report"
            icon={MdOutlineArrowDropDown}
            items={[
              { label: 'MS Word', icon: "us.svg", onClick: () => console.log('Using English') },
              { label: 'MS Excel', icon: "vn.svg", onClick: () => console.log('Using Vietnamese') },
              { label: 'PDF', icon: "vn.svg", onClick: () => console.log('Using Vietnamese') },

          ]}/>
        </div>
        <div className="item language">
          <MoreButton
            label="Project"
            icon={MdOutlineArrowDropDown}
            items={[
              { label: 'English', icon: "us.svg", onClick: () => console.log('Using English') },
              { label: 'Vietnamese', icon: "vn.svg", onClick: () => console.log('Using Vietnamese') },
          ]}/>
        </div>

        <div className='icon letter-box'>
          <IoIosMail />
        </div>
        <div className="icon notification">
          <IoMdNotifications />
        </div>
        <div className="icon user">
          <FaUser/>
        </div>
      </div>
    </div>
  )
}
