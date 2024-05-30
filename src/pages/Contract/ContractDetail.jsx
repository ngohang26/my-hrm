import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../employees/employee.css'
import './ContractDetail.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {apiUrl} from '../../config'

function ContractDetail() {
  const [contract, setContract] = useState(null);
  const [displaySalary, setDisplaySalary] = useState('');

  const { employeeCode } = useParams();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch(`${apiUrl}/employees/${employeeCode}/contract`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then(response => response.json())
      .then(data => {
        setContract(data);
        if (data.monthlySalary) {
          setDisplaySalary(data.monthlySalary.toString());
        }
      });
  }, [employeeCode]);

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${apiUrl}/employees/${employeeCode}/contract`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(contract),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Có lỗi xảy ra khi cập nhật hợp đồng');
        }
        return response.json();
      })
      .then(data => {
        setContract(data);
        toast.success('Cập nhật thành công');  
        setTimeout(() => {
          navigate('/hrm/contracts');
        }, 2000);
      })
      .catch(error => {
        toast.error(error.message);
      });
  };
  
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

        <form onSubmit={handleSubmit}>
          <div className='container-grid'>
            <div className="form-grid grid-item">
              <div className="item-info">
                <label>Ngày bắt đầu</label>
                <input type="date" value={contract.startDate} onChange={e => setContract({ ...contract, startDate: e.target.value })} />
              </div>
              <div className="item-info">
                <label>
                  Ngày kết thúc
                </label>
                <input type="date" value={contract.endDate} onChange={e => setContract({ ...contract, endDate: e.target.value })} />
              </div>
            </div>
            <div className="form-grid grid-item">
              <div className="item-info">

                <label>
                  Lương cơ bản
                </label>

                <input type="text" value={displaySalary} onChange={handleSalaryChange} /> đ
              </div>
              <div className="item-info">

                <label>
                  Ghi chú
                </label>
                <input type="text" value={contract.noteContract} onChange={e => setContract({ ...contract, noteContract: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="btn-update">
            <button type="submit">Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );

}

export default ContractDetail;
