import React, { useState } from 'react';
import { useContext } from 'react';
import {SubMenuItem} from '../sub-menu-item/SubMenuItem'
import './menu-item.css'
import PermissionContext from '../../Auth/PermissionContext';

function MenuItem({ title, icon, subItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subItemSelected, setSubItemSelected] = useState(-1);
  const permissions = useContext(PermissionContext); 
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className='menu-item'>
      <div onClick={toggle}>
        {icon}
        {title}
      </div>
      {isOpen && subItems.map((subItem, index) => {
        const hasPermission = permissions.includes(subItem.permission);
        return (
          <SubMenuItem key={index} title={subItem.title} path={subItem.path} subItemSelected={subItemSelected} index={index} setSubItemSelected={setSubItemSelected} disabled={!hasPermission}/>
        );
      })}
    </div>
  );
};


export default MenuItem
