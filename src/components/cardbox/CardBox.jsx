import React, { useState, useEffect } from 'react'
import './cardbox.css'
import { LuUsers2 } from "react-icons/lu";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdBadge } from 'react-icons/md';
import { apiUrl } from '../../config';



export const CardBox = () => {
  const [summary, setSummary] = useState({});
  const token = localStorage.getItem('accessToken');
  useEffect(() => {
    fetch(`${apiUrl}/summary/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {

        setSummary(data);
      })
  }, []);
  const cardItems = [
    {
      icon: <LuUsers2 size={35} />,
      label: "Người dùng",
      count: summary.userCount
    },
    {
      icon: <FaRegFolderOpen size={35} />,
      label: "Ứng viên",
      count: summary.candidateCount
    },
    {
      icon: <MdBadge size={35} />,
      label: "Nhân viên",
      count: summary.employeeCount
    },
  ];
  
  return (
    <div className='card-box'>
      {cardItems.map((card, index) => (
        <div key={index} className={`card-item card-item-${index}`}>
          <div className="card-tag">{card.count}</div>
          <span>{card.icon}</span>
          <span>{card.label}</span>
        </div>
      ))}
    </div>
  );
  
}
