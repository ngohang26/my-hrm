import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import {  Link } from 'react-router-dom';
import './sub-menu-item.css'
export const SubMenuItem = ({ title, path , index, subItemSelected, setSubItemSelected}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setSubItemSelected(index);
  };

  return (
    <Link to={path} onClick={handleClick} className='listItem'>
      {subItemSelected ===  index ? <FaArrowRight className='icon arrow-right' /> : <BsThreeDots className='icon three-dots'/>}
      {title}
    </Link>
  );
};