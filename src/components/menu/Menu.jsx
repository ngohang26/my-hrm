import { IoRocketOutline } from "react-icons/io5";
import { MenuItem } from '../menu-item/MenuItem';
import { PiProjectorScreenLight } from "react-icons/pi";
import { SlBriefcase } from "react-icons/sl";
import { PiLockKeyLight } from "react-icons/pi";
import './menu.css'
const menuItems = [
  {
    title: 'HRMS',
    icon: <IoRocketOutline className='icon rocket'/>,
    subItems: [
      { title: 'Dashboard', path: '/dashboard' },
      { title: 'Người dùng', path: '/users' },
      { title: 'Bộ phận', path: '/departments' },
      { title: 'Nhân viên', path: '/employees' }
    ]
  },
  {
    title: 'Bảng lương',
    icon: <PiProjectorScreenLight className='icon project'/>,
subItems: [
      { title: 'Bảng lương', path: '/payroll' },
      { title: 'Hợp đồng', path: '/contracts' },
      { title: 'Phiếu lương', path: '/payslip' },
      { title: 'Báo cáo', path: '/employee' }
    ]  },  {
    title: 'Chấm công',
    icon: <SlBriefcase className='icon briefcase'/>,
subItems: [
      { title: 'Chấm công', path: '/attendances' },
      { title: 'Báo cáo', path: '/dashboard' },
    ]  
  },  
  {
    title: 'Tuyển dụng',
    icon: <PiLockKeyLight className='icon lock'/>,
subItems: [
      { title: 'Ứng viên', path: '/users' },
      { title: 'Báo cáo', path: '/dashboard' },
    ]  
  },
  {
    title: 'Nghỉ phép',
    icon: <PiProjectorScreenLight className='icon project'/>,
subItems: [
      { title: 'Bảng thông tin', path: '/user' },
      { title: 'Tổng quan', path: '/dashboard' },
      { title: 'Quản lý', path: '/department' },
      { title: 'Báo cáo', path: '/employee' }
    ]   
  },
  
];

export const Menu = ({isMenuOpen}) => {
  if(!isMenuOpen) {
    return null;
  }
  return (
    <div className='menu'>
      <h5>ToLo HR</h5>
      {menuItems.map((item) => (
        <MenuItem icon={item.icon} title={item.title} subItems={item.subItems} />
      ))}
    </div>
  )
}