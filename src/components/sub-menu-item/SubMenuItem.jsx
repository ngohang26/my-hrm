import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import {  Link } from 'react-router-dom';
import './sub-menu-item.css'
export const SubMenuItem = ({ title, path }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <Link to={path} onClick={handleClick} className='listItem'>
      {isClicked ? <FaArrowRight className='icon arrow-right' /> : <BsThreeDots className='icon three-dots'/>}
      {title}
    </Link>
  );
};