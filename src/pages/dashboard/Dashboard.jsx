import React, { useState, useEffect } from 'react'
import { CardBox } from '../../components/cardbox/CardBox'
import './Dashboard.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { PieChart, Pie, Cell, Tooltip, Legend, Treemap } from 'recharts';
import { apiUrl } from '../../config'
import { DataGrid } from '@mui/x-data-grid';

export const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [genderData, setGenderData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const COLORS = ['#494764', '#cfcee9'];
  const [candidates, setCandidates] = useState([]);

  const onChange = (date) => {
    setDate(date);
  };
  const fetchCandidates = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${apiUrl}/candidates/getAllCandidates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let data = await response.json();
      data = data.slice(-6);
      setCandidates(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const tableColumns = [
    { field: 'candidateName', headerName: 'TÊN ỨNG VIÊN', flex: 1, sortable: false },
    { field: 'email', headerName: 'ĐỊA CHỈ EMAIL', flex: 1.4, sortable: false },
    { field: 'phoneNumber', headerName: 'SỐ ĐIỆN THOẠI', flex: 1, sortable: false },
    { field: 'dateApplied', headerName: 'NGÀY ỨNG TUYỂN', flex: 0.9, type: Date, sortable: false },
    {
      field: 'currentStatus',
      headerName: 'TRẠNG THÁI ', sortable: false,
      renderCell: (params) => {
        let color;
        let backgroundColor;
        let statusText;
        switch (params.value) {
          case 'NEW':
            color = '#656262';
            backgroundColor = '#d1d3d4';
            statusText = 'Mới';
            break;
          case 'INITIAL_REVIEW':
            color = '#fff';
            backgroundColor = '#8c9df0';
            statusText = 'Đánh giá ban đầu';
            break;
          case 'FIRST_INTERVIEW':
            color = '#fff';
            backgroundColor = '#add8e6';
            statusText = 'Phỏng vấn vòng 1';
            break;
          case 'SECOND_INTERVIEW':
            color = '#fff';
            backgroundColor = '#90ee90';
            statusText = 'Phỏng vấn vòng 2';
            break;
          case 'OFFER_MADE':
            color = '#fff';
            backgroundColor = '#ffb6c1';
            statusText = 'Đã đưa ra lời đề nghị';
            break;
          case 'REFUSE':
            color = '#fff';
            backgroundColor = '#ff6347';
            statusText = 'Từ chối';
            break;
          case 'CONTRACT_SIGNED':
            color = '#fff';
            backgroundColor = '#87cefa';
            statusText = 'Đã ký hợp đồng';
            break;
          default:
            color = '#f5f6ef';
            backgroundColor = '#edeeb4';
            statusText = 'Không xác định';
        }
        return (
          <div style={{ color, backgroundColor, padding: "3px 6px", borderRadius: '5px' }}>
            {statusText}
          </div>
        );
      },
      flex: 1.2
    },
  ]
  useEffect(() => {
    fetchCandidates();

    // const fetchData = async () => {
    //   const token = localStorage.getItem('accessToken');
    //   const response = await fetch(`${apiUrl}/departments/getAllDepartments`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     }
    //   });
    //   const departments = await response.json();
    //   console.log(departments)
    //   const transformedData = departments.map(dept => ({
    //     name: dept.departmentName,
    //     size: dept.employeeCount,   
    //     label: `${dept.departmentName} (${dept.employeeCount})`  
    //   }));
    //   console.log(transformedData)


    //   setDepartmentData(transformedData);  
    // };

    // fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    fetch(`${apiUrl}/employees/genderPercentage`, {
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
        <div>
          <DataGrid
            rows={candidates}
            columns={tableColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
            disableColumnMenu={true}
            hideFooter
          />

        </div>
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  )
}

