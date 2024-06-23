import React, { useEffect, useState } from 'react';
import '../employees/employee.css'
import './ContractDetail.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { apiUrl } from '../../config'
import { Helmet, HelmetProvider } from 'react-helmet-async';

function YourContract() {
  const [contract, setContract] = useState(null);
  const [displaySalary, setDisplaySalary] = useState('');

  const token = localStorage.getItem('accessToken');
  const decodedToken = jwtDecode(token);
  const employeeCode = decodedToken.username;
  useEffect(() => {
    fetch(`${apiUrl}/employees/${employeeCode}/contract`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setContract(data);
        if (data.monthlySalary) {
          setDisplaySalary(data.monthlySalary.toString());
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });

  }, [employeeCode]);

  // const formatNumber = (num) => {
  //   return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  // };

  if (!contract) {
    return <div>Loading...</div>;
  }
  return (
    <HelmetProvider>
      <ToastContainer />
      <Helmet>
        <title>Hợp đồng của bạn</title>
      </Helmet>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
        <div className='contract-dt'>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '40px 40px 0px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '20px' }}>Mã nhân viên: <b>{contract.employeeCode} </b></label>
              <label>Tên nhân viên: <b>{contract.fullName} </b></label>
            </div>
            <label>Mã hợp đồng: <b>{contract.contractCode} </b></label>
          </div>
          <div className='container-grid'>
            <div className="form-grid grid-item">
              <div className="item-info">
                <label>Ngày bắt đầu</label>
                <input type="text" value={contract.startDate} readOnly />
              </div>
              <div className="item-info">
                <label>
                  Ngày kết thúc
                </label>
                <input type="text" value={contract.endDate} readOnly />
              </div>
            </div>
            <div className="form-grid grid-item">
              <div className="item-info">
                <label>
                  Lương cơ bản
                </label>
                <input type="text" value={displaySalary} readOnly />
              </div>
              <div className="item-info">

                <label>
                  Ghi chú
                </label>
                <input type="text" value={contract.noteContract} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );

}

export default YourContract;
