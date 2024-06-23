import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './sub-menu-item.css';

export const SubMenuItem = ({ title, path, index, subItemSelected, setSubItemSelected, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      setSubItemSelected(index);
    }
  };

  const listItemStyle = disabled ? { display: 'none' } : {};
  const titleStyle = subItemSelected === index ? { fontWeight: 600 } : {};

  return (
    <Link to={path} onClick={handleClick} className='listItem' style={listItemStyle}>
      {subItemSelected === index ? <FaArrowRight className='icon arrow-right' /> : <BsThreeDots className='icon three-dots'/>}
      <span style={titleStyle}>{title}</span>
    </Link>
  );
};
