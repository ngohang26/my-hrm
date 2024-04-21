import { IoRocketOutline } from "react-icons/io5";
import { MenuItem } from '../menu-item/MenuItem';
import { PiProjectorScreenLight } from "react-icons/pi";
import { SlBriefcase } from "react-icons/sl";
import { PiLockKeyLight } from "react-icons/pi";
import './menu.css'
const menuItems = [
  {
    title: <strong>HRMS</strong>,
    icon: <IoRocketOutline className='icon rocket' />,
    subItems: [
      { title: 'Dashboard', path: '/hrm/dashboard' },
      { title: 'Người dùng', path: '/hrm/users' },
      { title: 'Bộ phận', path: '/hrm/departments' },
      { title: 'Nhân viên', path: '/hrm/employees' }
    ]
  },
  {
    title: <strong>Bảng lương</strong>,
    icon: <PiProjectorScreenLight className='icon project' />,
    subItems: [
      { title: 'Bảng lương', path: '/hrm/payroll' },
      { title: 'Hợp đồng', path: '/hrm/contracts' },
      { title: 'Phiếu lương', path: '/hrm/payslip' },
      { title: 'Báo cáo', path: '/hrm/employee' }
    ]
  }, {
    title: <strong>Chấm công</strong>,
    icon: <SlBriefcase className='icon briefcase' />,
    subItems: [
      { title: 'Chấm công', path: '/hrm/attendances' },
      { title: 'Báo cáo', path: '/hrm/dashboard' },
    ]
  },
  {
    title: <strong>Tuyển dụng</strong>,
    icon: <PiLockKeyLight className='icon lock' />,
    subItems: [
      { title: 'Ứng viên', path: '/hrm/users' },
      { title: 'Báo cáo', path: '/hrm/dashboard' },
    ]
  },
  //   {
  //     title: 'Nghỉ phép',
  //     icon: <PiProjectorScreenLight className='icon project'/>,
  // subItems: [
  //       { title: 'Bảng thông tin', path: '/hrm/user' },
  //       { title: 'Tổng quan', path: '/hrm/dashboard' },
  //       { title: 'Quản lý', path: '/hrm/department' },
  //       { title: 'Báo cáo', path: '/hrm/employee' }
  //     ]   
  //   },

];

export const Menu = ({ isMenuOpen }) => {
  if (!isMenuOpen) {
    return null;
  }
  return (
    <div className='menu'>
      <h5>ToLo HR</h5>
      {menuItems.map((item, index) => (
        <MenuItem key={index} icon={item.icon} title={item.title} subItems={item.subItems} />
      ))}
    </div>
  )
}