import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CandidateForm from './CandidateForm';
import DataTable from '../../components/dataTable/DataTable';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineSettings } from 'react-icons/md';
import UpdateStatusModal from './UpdateStatusModal';
import { type } from '@testing-library/user-event/dist/type';

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [mode, setMode] = useState('add');
  const [showEditTab, setShowEditTab] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const [jobPositions, setJobPositions] = useState([]);
  const [selectedJobPositionId, setSelectedJobPositionId] = useState();
  useEffect(() => {
    fetchCandidates();
    fetchJobPositions();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleOpenModal = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchCandidates = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch('http://localhost:8080/candidates/getAllCandidates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchJobPositions = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://localhost:8080/jobPositions/getAllJobPositions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setJobPositions(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus, interviewTime, secondInterviewTime, startDate, endDate, noteContract, monthlySalary, identityCardNumber) => {
    const token = localStorage.getItem('accessToken');
    let body = {};
    switch (newStatus) {
      case 'INITIAL_REVIEW':
        body = {
          newStatus: newStatus
        };
        break;
      case 'FIRST_INTERVIEW':
        body = {
          newStatus: newStatus,
          candidateDetails: {
            interviewTime: interviewTime
          }
        };
        break;
      case 'SECOND_INTERVIEW':
        body = {
          newStatus: newStatus,
          candidateDetails: {
            secondInterviewTime: secondInterviewTime
          }
        };
        break;
      case 'OFFER_MADE':
        body = {
          newStatus: newStatus,
          candidateDetails: {
            jobOffer: {
              startDate: startDate,
              endDate: endDate,
              noteContract: noteContract,
              monthlySalary: monthlySalary
            }
          }
        };
        break;
      case 'REFUSE':
        body = {
          newStatus: newStatus
        };
        break;
      case 'CONTRACT_SIGNED':
        body = {
          newStatus: newStatus,
          candidateDetails: {
            identityCardNumber: identityCardNumber
          }
        };
        break;
      default:
        break;
    }

    const response = await fetch(`http://localhost:8080/candidates/${id}/updateStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Error:', await response.text());
    } else {
      fetchCandidates();
    }
  };


  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setSelectedJobPositionId(candidate.jobPosition.id); // Thêm dòng này

    setMode('edit');
    setShowEditTab(true);
    setTabIndex(2);
  };
  const tableColumns = [
    { field: 'candidateName', headerName: 'TÊN ỨNG VIÊN', flex: 1 },
    { field: 'email', headerName: 'ĐỊA CHỈ EMAIL', flex: 1.4 },
    { field: 'phoneNumber', headerName: 'SỐ ĐIỆN THOẠI', flex: 1 },
    // { field: 'jobPosition', headerName: 'VỊ TRÍ CÔNG  VIỆC', flex: 1, valueGetter: (params) => params.row.jobPosition.jobPositionName, },
    { field: 'dateApplied', headerName: 'NGÀY ỨNG TUYỂN', flex: 1.2, type: Date },
    { field: 'currentStatus', headerName: 'TRẠNG THÁI', flex: 1 }, // them mau 
    {
      field: 'edit',
      headerName: 'HÀNH ĐỘNG',
      renderCell: (params) => (
        <div>
          <button
            onClick={() => handleOpenModal(params.row)}
            className='btn-action'
            disabled={params.row.currentStatus === 'REFUSE' || params.row.currentStatus === 'CONTRACT_SIGNED'}
            style={{ opacity: (params.row.currentStatus === 'REFUSE' || params.row.currentStatus === 'CONTRACT_SIGNED') ? 0.5 : 1 }}>            <MdOutlineSettings color='#000' title='Cập nhật trạng thái' />
          </button>
          <button onClick={() => handleEditCandidate(params.row)} className='btn-action'>
            {/* viet API */}
            <FiEdit color='#000' title='Sửa' />
          </button>
        </div>
      ),
      flex: 0.6,
    },

  ];

  const handleTabSelect = (index) => {
    if (((tabIndex === 2 || tabIndex === 1) && index === 0) || (tabIndex === 2 && index === 1)) {
      const confirmLeave = window.confirm('Bạn có chắc chắn muốn rời đi mà không lưu?');
      if (!confirmLeave) {
        return;
      }
    }

    setTabIndex(index);

    if (index === 1 || index === 0) {
      setEditingCandidate(null);
      setMode('add');
      setShowEditTab(false);
    }
  };


  return (
    <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
      <TabList className='tablist'>
        <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
        <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>+ Thêm</Tab>
        {showEditTab && (
          <Tab className={`tab-item ${tabIndex === 2 ? 'active' : ''}`} style={{ color: tabIndex === 2 ? '#5a5279' : 'gray' }}>Sửa</Tab>
        )}
      </TabList>
      <TabPanel>
        <DataTable columns={tableColumns} data={candidates} />
      </TabPanel>
      <TabPanel>
        {mode === 'add' && <CandidateForm
          mode={mode}
          setTabIndex={setTabIndex}
          jobPositions={jobPositions}
          fetchCandidates={fetchCandidates}
          selectedJobPositionId={selectedJobPositionId}
          setSelectedJobPositionId={setSelectedJobPositionId}

        />}
      </TabPanel>
      {showEditTab && (
        <TabPanel>
          {mode === 'edit' && editingCandidate && <CandidateForm mode={mode}
            currentCandidate={editingCandidate}
            setTabIndex={setTabIndex}
            setShowEditTab={setShowEditTab}
            jobPositions={jobPositions}
            fetchCandidates={fetchCandidates}
            selectedJobPositionId={selectedJobPositionId}
            setSelectedJobPositionId={setSelectedJobPositionId}
          />}
        </TabPanel>
      )}
      <UpdateStatusModal
        open={openModal}
        onClose={handleCloseModal}
        onUpdate={handleUpdateStatus}
        candidate={selectedCandidate}
        selectedCandidate={selectedCandidate}
      />
    </Tabs>
  );

};

export default Candidate;
