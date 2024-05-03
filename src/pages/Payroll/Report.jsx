import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const Report = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [lineChartData, setLineChartData] = useState([]);
  const COLORS = ['#ed9145', '#51ade7', '#e0d671' ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');

      const overtimeHoursResponse = await fetch(`http://localhost:8080/employeeSalary/totalOvertimeHoursByDepartment/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const overtimeHours = await overtimeHoursResponse.json();

      const incomeTaxResponse = await fetch(`http://localhost:8080/employeeSalary/totalIncomeTaxByDepartment/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const incomeTax = await incomeTaxResponse.json();

      const totalOvertimeHoursPerMonthResponse = await fetch(`http://localhost:8080/employeeSalary/totalOvertimeHoursPerMonth/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const totalOvertimeHoursPerMonth = await totalOvertimeHoursPerMonthResponse.json();

      const dataForChart = transformDataForChart(overtimeHours, incomeTax);
      setData(dataForChart);

      const dataForLineChart = transformLineChartData(totalOvertimeHoursPerMonth);
      setLineChartData(dataForLineChart);
    }

    fetchData();
  }, [year, month]);

  const transformDataForChart = (overtimeHours, incomeTax) => {
    const departments = Object.keys(overtimeHours);
    const transformedData = departments.map(department => ({
      name: department,
      overtime: overtimeHours[department],
      tax: incomeTax[department]
    }));
    return transformedData;
  }

  const transformLineChartData = (totalOvertimeHoursPerMonth) => {
    const employees = Object.keys(totalOvertimeHoursPerMonth);
    const transformedData = employees.map(employee => ({
      name: employee,
      overtimeHour: totalOvertimeHoursPerMonth[employee]
    }));
    return transformedData;
  }

  return (
    <div>
      <h4>Báo cáo</h4>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="overtime"
          isAnimationActive={false}
          data={data}
          cx={200}
          cy={200}
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      {/* <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0}/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="overtime" fill="#8884d8" barSize={90}/>
      </BarChart> */}

      <LineChart
        width={500}
        height={300}
        data={lineChartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} fontSize={8} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="overtimeHour" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>

      <BarChart
        layout="vertical"
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey="tax" fill="#82ca9d" />

      </BarChart>
    </div>
  );
}

export default Report;
