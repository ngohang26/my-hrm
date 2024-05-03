import React from 'react'
import './cardbox.css'
import { LuUsers2 } from "react-icons/lu";
import { SlLike, SlEvent, SlCreditCard, SlCalculator, SlPieChart } from "react-icons/sl";
  const cardItems = [
    {
      icon: <LuUsers2 />,
      label: "Users"
    },
    {
      icon: <SlLike />,
      label: "Holidays"
    },
    {
      icon: <SlEvent />,
      label: "Events"
    },
    {
      icon: <SlCreditCard   />,
      label: "Payroll"
    },

    
  ]
export const CardBox = () => {


  return (
    <div className='card-box'>
      {cardItems.map((card) => (
        <div className="card-item">
            <span>{card.icon}</span>
            <span>{card.label}</span>
        </div>
      ))}
    </div>
  )
}
