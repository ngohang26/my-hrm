import { IoRocketOutline } from "react-icons/io5";
import { PiProjectorScreenLight } from "react-icons/pi";
import { SlBriefcase } from "react-icons/sl";
import { PiLockKeyLight } from "react-icons/pi";
import './menu.css'
import MenuItem from "../menu-item/MenuItem";
import { useState, useEffect } from "react";
const menuItems = [
  {
    title: <strong>HRMS</strong>,
    icon: <IoRocketOutline className='icon rocket' />,
    subItems: [
      { title: 'Dashboard', path: '/hrm/dashboard', permission: 'VIEW_EMPLOYEE' },
      { title: 'Người dùng', path: '/hrm/users', permission: 'EDIT_USER' },
      { title: 'Bộ phận', path: '/hrm/departments', permission: 'ADD_DEPARTMENT' },
      { title: 'Nhân viên', path: '/hrm/employees', permission: 'ADD_EMPLOYEE' },
      { title: 'Hồ sơ của bạn', path: '/hrm/employee', permission: 'VIEW_EMPLOYEE' },
      { title: 'Báo cáo', path: '/hrm/report', permission: 'VIEW_SALARY' }
    ]
  },
  {
    title: <strong>Bảng lương</strong>,
    icon: <PiProjectorScreenLight className='icon project' />,
    subItems: [
      { title: 'Bảng lương', path: '/hrm/payroll', permission: 'ADD_SALARY' },
      { title: 'Hợp đồng', path: '/hrm/contracts', permission: 'ADD_CONTRACT' },
      { title: 'Hợp đồng của bạn', path: '/hrm/contract', permission: 'VIEW_CONTRACT' },
      { title: 'Phiếu lương', path: '/hrm/payslip', permission: 'VIEW_SALARY' },
      { title: 'Quản lý trợ cấp', path: '/hrm/allowance', permission: 'ADD_SALARY' },
    ]
  }, {
    title: <strong>Chấm công</strong>,
    icon: <SlBriefcase className='icon briefcase' />,
    subItems: [
      { title: 'Chấm công', path: '/hrm/attendances', permission: 'VIEW_ATTENDANCE' },
    ]
  },
  {
    title: <strong>Tuyển dụng</strong>,
    icon: <PiLockKeyLight className='icon lock' />,
    subItems: [
      { title: 'Ứng viên', path: '/hrm/candidates', permission: 'ADD_CANDIDATE' },
      { title: 'Vị trí tuyển dụng', path: '/hrm/jobPositions', permission: 'ADD_CANDIDATE' },
    ]
  },

];


export const Menu = ({ isMenuOpen }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleTitleClick = (index) => {
    setOpenIndex(index);
  };

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className='menu'>
      <h5>ToLo HR</h5>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          subItems={item.subItems}
          isOpen={index === openIndex}
          onTitleClick={() => handleTitleClick(index)}
        />
      ))}
    </div>
  )
}