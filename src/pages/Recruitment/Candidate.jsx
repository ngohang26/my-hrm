import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CandidateForm from './CandidateForm';
import DataTable from '../../components/dataTable/DataTable';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineSettings } from 'react-icons/md';
import UpdateStatusModal from './UpdateStatusModal';
import './Candidate.css'
import { apiUrl } from '../../config'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [mode, setMode] = useState('add');
  const [showEditTab, setShowEditTab] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const [jobPositions, setJobPositions] = useState([]);
  const [candidateCountByStatus, setCandidateCountByStatus] = useState({ NEW: 0, INITIAL_REVIEW: 0, FIRST_INTERVIEW: 0, SECOND_INTERVIEW: 0, OFFER_MADE: 0, CONTRACT_SIGNED: 0, REFUSE: 0 });
  const [selectedJobPositionId, setSelectedJobPositionId] = useState();
  useEffect(() => {
    fetchCandidates();
    fetchData();
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
      const response = await fetch(`${apiUrl}/candidates/getAllCandidates`, {
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

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const responseJobPosition = await fetch(`${apiUrl}/jobPositions/getAllJobPositions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const jobPosition = await responseJobPosition.json();

      const responseCandidateCountByStatus = await fetch(`${apiUrl}/candidates/getCandidateCountByStatus`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const candidateCountByStatus = await responseCandidateCountByStatus.json();

      const candidateCount = {};
      for (let status in candidateCountByStatus) {
        candidateCount[status] = candidateCountByStatus[status].count;
      }

      setJobPositions(jobPosition);
      setCandidateCountByStatus(candidateCount);
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
          identityCardNumber: identityCardNumber
        };
        break;
      default:
        break;
    }

    const response = await fetch(`${apiUrl}/candidates/${id}/updateStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    console.log(body)
    if (!response.ok) {
      const error = await response.text()
      console.error('Error:', error);
      toast.error(error)
    } else {
      toast.success("Cập nhật trạng thái tuyển dụng thành công!")
      fetchCandidates();
      fetchData();
    }
  };
  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setSelectedJobPositionId(candidate.jobPosition.id);

    setMode('edit');
    setShowEditTab(true);
    setTabIndex(2);
  };
  const tableColumns = [
    { field: 'candidateName', headerName: 'TÊN ỨNG VIÊN', flex: 1 },
    { field: 'email', headerName: 'ĐỊA CHỈ EMAIL', flex: 1.4 },
    { field: 'phoneNumber', headerName: 'SỐ ĐIỆN THOẠI', flex: 1 },
    { field: 'dateApplied', headerName: 'NGÀY ỨNG TUYỂN', flex: 0.9, type: Date },
    {
      field: 'currentStatus',
      headerName: 'TRẠNG THÁI ',
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
      flex: 1.1
    },
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
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleFilterStatus = (status) => {
    setSelectedStatus(status);
    setFilterStatus(status);
  };

  const getFilteredCandidates = () => {
    return candidates.filter((candidate) =>
      filterStatus === '' || candidate.currentStatus === filterStatus
    );
  };

  return (
    <HelmetProvider>
      <ToastContainer />
      <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
        <Helmet>
          <title>Quản lý ứng viên</title>
        </Helmet>
        <TabList className='tablist'>
          <Tab className={`tab-item ${tabIndex === 0 ? 'active' : ''}`} style={{ color: tabIndex === 0 ? '#5a5279' : 'gray' }}>Danh sách</Tab>
          <Tab className={`tab-item ${tabIndex === 1 ? 'active' : ''}`} style={{ color: tabIndex === 1 ? '#5a5279' : 'gray' }}>+ Thêm</Tab>
          {showEditTab && (
            <Tab className={`tab-item ${tabIndex === 2 ? 'active' : ''}`} style={{ color: tabIndex === 2 ? '#5a5279' : 'gray' }}>Sửa</Tab>
          )}
        </TabList>
        <TabPanel>
          <div className="candidate-container">
            <div className="status-filter-column">
              <button className={selectedStatus === '' ? 'selected' : ''} onClick={() => handleFilterStatus('')}>Tất cả</button>
              <button className={selectedStatus === 'NEW' ? 'selected' : ''} onClick={() => handleFilterStatus('NEW')}>Mới<span className="status-count status-count-new">{candidateCountByStatus['NEW'] || 0}</span></button>
              <button className={selectedStatus === 'INITIAL_REVIEW' ? 'selected' : ''} onClick={() => handleFilterStatus('INITIAL_REVIEW')}>Đánh giá ban đầu<span className="status-count status-count-initial-review">{candidateCountByStatus['INITIAL_REVIEW'] || 0}</span></button>
              <button className={selectedStatus === 'FIRST_INTERVIEW' ? 'selected' : ''} onClick={() => handleFilterStatus('FIRST_INTERVIEW')}>Phỏng vấn lần 1<span className="status-count status-count-first-interview">{candidateCountByStatus['FIRST_INTERVIEW'] || 0}</span></button>
              <button className={selectedStatus === 'SECOND_INTERVIEW' ? 'selected' : ''} onClick={() => handleFilterStatus('SECOND_INTERVIEW')}>Phỏng vấn lần 2<span className="status-count status-count-second-interview">{candidateCountByStatus['SECOND_INTERVIEW'] || 0}</span></button>
              <button className={selectedStatus === 'OFFER_MADE' ? 'selected' : ''} onClick={() => handleFilterStatus('OFFER_MADE')}>Đã đề nghị<span className="status-count status-count-offer-made">{candidateCountByStatus['OFFER_MADE'] || 0}</span></button>
              <button className={selectedStatus === 'CONTRACT_SIGNED' ? 'selected' : ''} onClick={() => handleFilterStatus('CONTRACT_SIGNED')}>Đã ký hợp đồng<span className="status-count status-count-contract-signed">{candidateCountByStatus['CONTRACT_SIGNED'] || 0}</span></button>
              <button className={selectedStatus === 'REFUSE' ? 'selected' : ''} onClick={() => handleFilterStatus('REFUSE')}>Từ chối<span className="status-count status-count-refuse">{candidateCountByStatus['REFUSE'] || 0}</span></button>
            </div>
            <div className="datatable-container">
              <DataTable columns={tableColumns} data={getFilteredCandidates()} />
            </div>
          </div>
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
    </HelmetProvider>

  );

};

export default Candidate;
