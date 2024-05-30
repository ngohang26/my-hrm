import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import {SubMenuItem} from '../sub-menu-item/SubMenuItem'
import './menu-item.css'
import PermissionContext from '../../Auth/PermissionContext';

import { useLocation } from 'react-router-dom';  

function MenuItem({ title, icon, subItems, isOpen, onTitleClick }) {
  const [subItemSelected, setSubItemSelected] = useState(-1);
  const permissions = useContext(PermissionContext); 
  const location = useLocation();  

  useEffect(() => {
    const index = subItems.findIndex(subItem => subItem.path === location.pathname);
    setSubItemSelected(index !== -1 ? index : -1);
  }, [location, subItems]);

  useEffect(() => {
    if (!isOpen) {
      setSubItemSelected(-1); 
    }
  }, [isOpen]);
  return (
    <div className='menu-item'>
      <div onClick={onTitleClick}>
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
