import React, { useState, useEffect } from 'react'
import { CardBox } from '../../components/cardbox/CardBox'
import './Dashboard.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [genderData, setGenderData] = useState([]);
  const COLORS = ['#494764', '#cfcee9' ];

  const onChange = (date) => {
    setDate(date);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    fetch('http://localhost:8080/employees/genderPercentage', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setGenderData([
          { name: 'Nam', value: data.malePercentage },
          { name: 'Nữ', value: data.femalePercentage }
        ]);
      });
  }, []);

  return (
    <div className='dashboard'>
      <div className="left-dashboard">
        <div className="top-dashboard">
          <div className="top-text">
            <h2>Xin chào,</h2>
            <p>xxxxxx</p>
          </div>
          <img src='/HR_dashboard.png'></img>
        </div>
        <CardBox />
      </div>
      <div className="right-dashboard">
        <div className='calendar'>
          <Calendar
            onChange={onChange}
            value={date}
          />
        </div>
        <div className="chart-dashboard">
          <h4>Giới tính của nhân viên</h4>
        <PieChart width={280} height={280}>
            <Pie
              data={genderData}
              cx={155}
              cy={140}
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
            >
              {genderData.map((entry, index) => (
                <Cell  key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip/>
            <Legend/>
          </PieChart>
        </div>
      </div>
    </div>
  )
}
