import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../employees/employee.css'
import './ContractDetail.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContractView() {
  const [contract, setContract] = useState(null);
  const [displaySalary, setDisplaySalary] = useState('');

  const { employeeCode } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/employees/${employeeCode}/contract`)
      .then(response => response.json())
      .then(data => {
        setContract(data);
        if (data.monthlySalary) {
          setDisplaySalary(data.monthlySalary.toString());
        }
      });
  }, [employeeCode]);

  
  
  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const handleSalaryChange = (event) => {
    const displayValue = event.target.value;

    const valueWithoutCommas = displayValue.replace(/,/g, '');

    const actualValue = Number(valueWithoutCommas);

    setContract({ ...contract, monthlySalary: actualValue });

    setDisplaySalary(formatNumber(actualValue));
  };


  if (!contract) {
    return <div>Loading...</div>;
  }
  return (
    <div>

      <ToastContainer/>
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
                <input type="text" value={contract.startDate}   />
              </div>
              <div className="item-info">
                <label>
                  Ngày kết thúc
                </label>
                <input type="text" value={contract.endDate}   />
              </div>
            </div>
            <div className="form-grid grid-item">
              <div className="item-info">

                <label>
                  Lương cơ bản
                </label>

                <input type="text" value={displaySalary}   /> đ
              </div>
              <div className="item-info">

                <label>
                  Ghi chú
                </label>
                <input type="text" value={contract.noteContract}   />
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  );

}

export default ContractView;
