import React, { useState } from 'react';
import {SubMenuItem} from '../sub-menu-item/SubMenuItem'
import './menu-item.css'
export const MenuItem = ({ title, icon, subItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subItemSelected, setSubItemSelected] = useState(-1);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='menu-item'>
      <div onClick={toggle}>
        {icon}
        {title}
      </div>
      {isOpen && subItems.map((subItem, index) => (
        <SubMenuItem title={subItem.title} path={subItem.path} subItemSelected={subItemSelected} index={index} setSubItemSelected={setSubItemSelected}/>
      ))}
    </div>
  );
};



