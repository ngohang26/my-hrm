import React, { useEffect, useState } from 'react';
import { apiUrl } from '../config'
import { GaugeChart } from '../components/Chart/GaugeChart';
import { BarChartComponent } from '../components/Chart/BarChart';
import { LineChartComponent } from '../components/Chart/LineChart';
import { PieChartComponent } from '../components/Chart/PieChart';
import './Report.css'
import { FaArrowDown, FaArrowUp, FaClock, FaMoneyBillWave, FaUser } from 'react-icons/fa';
const Report = () => {
  const [data, setData] = useState([]);

  const [lineChartData, setLineChartData] = useState([]);
  const COLORS = ['#fac800', '#f76930', '#9bc957', '#fbb6c4', '#d2b9fc', '#41b2f8', '#3085ba'];
  const COLORS2 = ['#97baf6', '#fbb6c4', '#fbd9b3', '#d2b9fc', '#51ade7', '#fba35b', '#79c2a8'];
  const [employeeCountData, setEmployeeCountData] = useState([]);
  const [candidateStatusData, setCandidateStatusData] = useState({});
  const [workAndOvertimeData, setWorkAndOvertimeData] = useState([]);
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const [year, setYear] = useState(lastMonth.getFullYear());
  const [month, setMonth] = useState(lastMonth.getMonth() + 1);
  const [employeeData, setEmployeeData] = useState({});
  const [salaryData, setSalaryData] = useState({});
  const [workHoursData, setWorkHoursData] = useState({});

  const customLegendPayload1 = [
    { value: 'Giờ làm không tính giờ làm thêm', type: 'square', id: 'workTimeWithoutOvertime', color: '#82ca9d' },
    { value: 'Giờ làm thêm', type: 'square', id: 'overTime', color: '#8884d8' },
  ];

  const customLegendPayload2 = [
    { value: 'Thuế', type: 'square', id: 'tax', color: '#ffa228' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiUrl}/summary/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setEmployeeData({
        count: data.employeeCount,
        percentageChange: parseFloat(data.employeePercentageChange).toFixed(2)
      });
      setSalaryData({
        total: (data.totalSalary / 1000000).toFixed(2),
        percentageChange: parseFloat(data.salaryPercentageChange).toFixed(2)
      });
      setWorkHoursData({
        total: data.totalWorkHours,
        percentageChange: parseFloat(data.workHoursPercentageChange).toFixed(2)
      });
    }
    fetchData();
  }, [year, month]);
  useEffect(() => {
    const fetchData2 = async () => {
      const token = localStorage.getItem('accessToken');

      const overtimeHoursResponse = await fetch(`${apiUrl}/employeeSalary/totalOvertimeHoursByDepartment/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const overtimeHours = await overtimeHoursResponse.json();

      const incomeTaxResponse = await fetch(`${apiUrl}/employeeSalary/totalIncomeTaxByDepartment/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const incomeTax = await incomeTaxResponse.json();

      const totalOvertimeHoursPerMonthResponse = await fetch(`${apiUrl}/employeeSalary/totalOvertimeHoursPerMonth/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const totalOvertimeHoursPerMonth = await totalOvertimeHoursPerMonthResponse.json();

      const dataForChart = transformDataForChart(overtimeHours, incomeTax);
      setData(dataForChart);

      const dataForLineChart = transformLineChartData(totalOvertimeHoursPerMonth);
      setLineChartData(dataForLineChart);

      const workAndOvertimeResponse = await fetch(`${apiUrl}/attendances/total-work-hours/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const workAndOvertime = await workAndOvertimeResponse.json();

      const dataForTwoLineChart = Object.keys(workAndOvertime).map(date => ({
        date,
        workTimeWithoutOvertime: workAndOvertime[date].workTimeWithoutOvertime,
        overTime: workAndOvertime[date].overTime
      }));

      setWorkAndOvertimeData(dataForTwoLineChart);

    }

    fetchData2();
  }, [year, month]);
  useEffect(() => {
    const fetchEmployeeCountData = async () => {
      const token = localStorage.getItem('accessToken');

      const employeeCountResponse = await fetch(`${apiUrl}/departments/getAllDepartments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const employeeCount = await employeeCountResponse.json()

      setEmployeeCountData(employeeCount);
    }
    const fetchCandidateStatusData = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiUrl}/candidates/getCandidateCountByStatus`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCandidateStatusData(data);
    };

    fetchEmployeeCountData();
    fetchCandidateStatusData();
  }, []);

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

  const statusesToShow = ['NEW', 'INITIAL_REVIEW', 'FIRST_INTERVIEW', 'SECOND_INTERVIEW', 'OFFER_MADE', 'CONTRACT_SIGNED', 'REFUSE'];
  const statusMapping = {
    'NEW': 'Mới',
    'INITIAL_REVIEW': 'Đang xem xét',
    'FIRST_INTERVIEW': 'Phỏng vấn lần 1',
    'SECOND_INTERVIEW': 'Phỏng vấn lần 2',
    'OFFER_MADE': 'Đã đề nghị',
    'CONTRACT_SIGNED': 'Đã ký hợp đồng',
    'REFUSE': 'Từ chối'
  };

  const statusIcons = {
    'NEW': '/userIcon.svg',
    'INITIAL_REVIEW': '/productIcon.svg',
    'FIRST_INTERVIEW': '/conversionIcon.svg',
    'SECOND_INTERVIEW': '/revenueIcon.svg',
    'OFFER_MADE': '/userIcon.svg',
    'CONTRACT_SIGNED': '/userIcon.svg',
    'REFUSE': '/userIcon.svg'
  };


  return (
    <div className='reports'>
      <h3>Báo cáo</h3>
      <div className="report-container">
        <div className="report" >
          <div className="grid-left">
            <div className="report-employee">
              <div className="grid-item">
                <div className='grid-items'>
                  <div>
                    <h4>Số nhân viên</h4>
                    <h2>{employeeData.count}</h2>
                  </div>
                  <FaUser size={50} color='#a893dd' />
                </div>
                <span>
                  {employeeData.percentageChange > 0 ? <FaArrowUp /> : null}
                  {employeeData.percentageChange < 0 ? <FaArrowDown /> : null}
                  <strong>{Math.abs(employeeData.percentageChange)}%</strong> So với tháng trước
                </span>
              </div>
              <div className="grid-item">
                <div className="grid-items">
                  <div>
                    <h4>Tổng lương</h4>
                    <h2>{salaryData.total} Tr</h2>
                  </div>
                  <FaMoneyBillWave size={50} color='#a5d1dd' />
                </div>
                <span>
                  {employeeData.percentageChange > 0 ? <FaArrowUp /> : null}
                  {employeeData.percentageChange < 0 ? <FaArrowDown /> : null}
                  <strong>{Math.abs(salaryData.percentageChange)}%</strong> So với tháng trước
                </span>
              </div>

              <div className="grid-item">
                <div className="grid-items">
                  <div>
                    <h4>Tổng số giờ làm</h4>
                    <h2> {workHoursData.total}</h2>

                  </div>
                  <FaClock size={50} color='#619ee8' />
                </div>
                <span>
                  {employeeData.percentageChange > 0 ? <FaArrowUp /> : null}
                  {employeeData.percentageChange < 0 ? <FaArrowDown /> : null}
                  <strong>{Math.abs(workHoursData.percentageChange)}%</strong> So với tháng trước
                </span>
              </div>
            </div>
            <div className="chart-gauge">
              <div className="chart-container">
                {statusesToShow.slice(0, 6).map((status, index) => (
                  <div className="chart-item" key={index}>
                    <div>
                      <div className="title">
                        <img src={statusIcons[status]} alt={statusMapping[status]} />
                        <span>{statusMapping[status]}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <h1 style={{ color: '#56546c', marginLeft: '20px' }}>{candidateStatusData[status]?.count}</h1>
                        <span>📄</span>
                      </div>
                    </div>
                    <div>
                      <GaugeChart value={candidateStatusData[status]?.percentage} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-item2 chart-large">
                <div className="title">
                  <img src={statusIcons['REFUSE']} alt={statusMapping['REFUSE']} />
                  <span>{statusMapping['REFUSE']}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <h1 style={{ color: '#56546c' }}>{candidateStatusData['REFUSE']?.count}</h1>
                  <span>📄</span>
                </div>
                <GaugeChart value={candidateStatusData['REFUSE']?.percentage} />
              </div>
            </div>
          </div>
          <div className="chart-employee">
            <h4>Số lượng nhân viên theo bộ phận</h4>
            <PieChartComponent data={employeeCountData} dataKey="employeeCount" nameKey="departmentName" colors={COLORS2} cx={90} cy={90} paddingAngle={3} outerRadius={80} innerRadius={55} fill="#8884d8" />
          </div>
        </div >
        <br />
        <div className="report">
          <div className="grid-left">
            <div className="chart-employee chart-working-hours">
              <h4>Biểu đồ thể hiện thời gian làm việc bình thường và thời gian tăng ca</h4>
              <br />
              <BarChartComponent width={760} height={400} data={workAndOvertimeData} dataKey1="workTimeWithoutOvertime" dataKey2="overTime" nameKeyX="date" fill1="#82ca9d" fill2="#8884d8" layout="horizontal" barSize={10} legendPayload={customLegendPayload1} />

            </div>
          </div>
          <div className="chart-employee">
            <h4>Giờ làm thêm mỗi tháng bộ phận</h4>
            <PieChartComponent data={data} dataKey="overtime" colors={COLORS} cx={90} cy={90} paddingAngle={3} outerRadius={80} fill="#8884d8" />
          </div>
        </div>
        <br />
        <div className='bottom-report'>
          <div className="chart-employee">
            <BarChartComponent width={480} height={250} data={data} dataKey1="tax" nameKey="tax" nameKeyX="name" fill1="#ffa228" fill2="#fff" layout="horizontal" barSize={32} legendPayload={customLegendPayload2} />
          </div>
          <div className="chart-employee">
            <LineChartComponent data={lineChartData} dataKey1="overtimeHour" nameKey="name" stroke1="#8884d8" activeDot={{ r: 8 }} />
          </div>
        </div>
        <br />
      </div>
    </div>
  );
}

export default Report;