import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dataTable/DataTable';
import FormComponent from '../../components/Add/FormComponent';
import ConfirmDeleteModal from '../../components/Form/ConfirmDeleteModal';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {apiUrl} from '../../config'

const EmployeeAllowance = () => {
  const [employeeCode, setEmployeeCode] = useState("2403001");
  const [editing, setEditing] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [allowanceToDelete, setAllowanceToDelete] = useState(null);
  const [allowanceNameToId, setAllowanceNameToId] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [allowanceEmployee, setAllowanceEmployee] = useState([]);
  const employeeAllowanceColumns = [
    { field: 'order', headerName: 'STT', flex: 1 },
    { field: 'allowanceName', headerName: 'Tên trợ cấp', flex: 2.5 },
    { field: 'allowanceAmount', headerName: 'Số tiền', flex: 1.3 },
    { field: 'startDate', headerName: 'Tháng bắt đầu', flex: 1.3 },
    { field: 'endDate', headerName: 'Tháng kết thúc', flex: 1.3 },
    {
      field: 'actions',
      headerName: 'Hành động',
      flex: 1,
      renderCell: (params) => (
        <div className='action'>
          <button onClick={() => handleEdit(params.row)} className='btn-action'>
            <FiEdit color='#000' />
          </button>
          <button onClick={() => openDeleteModal(params.row.id)} className='btn-action'>
            <FiTrash color='#ff0000' />
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchAllowanceList();
    fetchEmployeeAllowances();
  }, []);

  const fetchAllowanceList = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${apiUrl}/allowance/getAllAllowances`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      const allowanceList = await response.json();
      setAllowanceEmployee(allowanceList);
      console.log('Allowance list:', allowanceList); // In ra danh sách trợ cấp

      const allowanceNameToId = {};
      for (let allowance of allowanceList) {
        allowanceNameToId[allowance.allowanceName] = allowance.id;
      }
      setAllowanceNameToId(allowanceNameToId);
    } else {
      console.error('Failed to fetch allowance list');
    }
  };
  
  
  async function fetchEmployeeAllowances() {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${apiUrl}/employee-allowances/${employeeCode}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const formattedAllowances = data.map((allowance, index) => ({
          order: index + 1,
          allowanceName: allowance.allowance.allowanceName,
          allowanceAmount: allowance.allowance.allowanceAmount,
          startDate: allowance.startDate,
          endDate: allowance.endDate,
          id: allowance.id
        }));
        setAllowances(formattedAllowances);
      } else {
        throw new Error('Failed to fetch employee allowances');
      }
    } catch (error) {
      console.error('Error fetching employee allowances:', error);
    }
  }
  async function addEmployeeAllowance(allowanceDetails) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${apiUrl}/employee-allowances/${employeeCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(allowanceDetails)
      });
      if (response.ok) {
        fetchEmployeeAllowances();
        setIsFormAddOpen(false);
        toast.success("Thêm trợ cấp cho nhân viên thành công")
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error adding employee allowance:', error);
      toast.error(`Lỗi: ${error.message}`);

    }
  }


  async function editEmployeeAllowance(id, allowanceDetails) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${apiUrl}/employee-allowances/${employeeCode}/allowances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(allowanceDetails)
      });
      if (response.ok) {
        fetchEmployeeAllowances();  
        toast.success("Sửa trợ cấp cho nhân viên thành công")
        setIsFormOpen(false);
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error editing employee allowance:', error);
      toast.error(`Lỗi: ${error.message}`);
    }
  }
  
  async function deleteEmployeeAllowance(id) {
    console.log('Deleting allowance with id:', id);  // Thêm dòng này để kiểm tra giá trị của id
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${apiUrl}/employee-allowances/${employeeCode}/allowances/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchEmployeeAllowances();
        setIsDeleteModalOpen(false);
      } else {
        throw new Error('Failed to delete employee allowance');
      }
    } catch (error) {
      console.error('Error deleting employee allowance:', error);
    }
  }  

  const openDeleteModal = (id) => {
    setAllowanceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  
  const handleFormSubmit = async (data) => {
    const selectedAllowanceId = data.allowanceName;  
    if (selectedAllowanceId) {
      const allowanceDetails = {
        allowance: {
          id: selectedAllowanceId,
        },
        startDate: data.startDate,
        endDate: data.endDate,
      };
      await addEmployeeAllowance(allowanceDetails);
      console.log(allowanceDetails);
    } else {
      toast.error("Bạn cần chọn trợ cấp")
      console.error('Không tìm thấy trợ cấp được chọn.');
    }
  };
  
  
  const handleFormEditSubmit = async (data) => {
    const allowanceDetails = {
      startDate: data.startDate,
      endDate: data.endDate,
    };
  
    await editEmployeeAllowance(editing.id, allowanceDetails);
    setEditing({});
  };
  
  
  const handleEdit = (allowance) => {
    setEditing(allowance);
    setIsFormOpen(true);
  };
  
  const handleConfirmDelete = () => {
    deleteEmployeeAllowance(allowanceToDelete);
  };

  useEffect(() => {
    fetchEmployeeAllowances();
  }, [employeeCode]);

  return (
    <div>
      <ToastContainer/>
  <div className="employee-code-input">
    <label htmlFor="employeeCode">Nhập mã nhân viên    </label>
    <input
      type="text"
      id="employeeCode"
      value={employeeCode}
      onChange={(e) => setEmployeeCode(e.target.value)} className='input-control'
    />
  </div>
  <div style={{width: '100%', textAlign: 'right'}}>
    <button onClick={() => setIsFormAddOpen(true)} className='btn-add'>+ Thêm</button>
  </div>
  {isFormAddOpen && (
    <div className="overlay">
      <FormComponent
        fields={[
          { field: 'allowanceName', headerName: 'Tên trợ cấp',type: 'select',
            options: allowanceEmployee.map(allowance => ({ id: allowance.id, name: allowance.allowanceName })),
          },
          { field: 'startDate', label: 'Tháng bắt đầu', type: 'month' },
          { field: 'endDate', label: 'Tháng kết thúc', type: 'month' },
        ]}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormAddOpen(false)}
        initialValues={editing}
      />
    </div>


      )}

      <DataTable
        columns={employeeAllowanceColumns}
        data={allowances}
        slug="allowance"
        showEditColumn={false}
      />
      {isFormOpen && (
        <div className="overlay">
          <FormComponent
            fields={[
              { field: 'startDate', label: 'Tháng bắt đầu', type: 'month' },
              { field: 'endDate', label: 'Tháng kết thúc', type: 'month' },
            ]}
            onSubmit={handleFormEditSubmit}
            onCancel={() => setIsFormOpen(false)}
            initialValues={editing}
          />
        </div>
      )}
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={closeDeleteModal} />
    </div>
  );
};

export default EmployeeAllowance;
