import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CandidateForm from './CandidateForm';
import DataTable from '../../components/dataTable/DataTable';

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
    // fetchDepartments();
  }, []);
  const token = localStorage.getItem('accessToken');


  const fetchCandidates = async () => {
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
  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setSelectedJobPositionId(candidate.jobPosition.id); // Thêm dòng này

    setMode('edit');
    setShowEditTab(true);
    setTabIndex(2);
  };
  const tableColumns = [
    { field: 'candidateName', headerName: 'MÃ NHÂN VIÊN', flex: 1 },
    { field: 'email', headerName: 'TÊN NHÂN VIÊN', flex: 1.4 },
    { field: 'phoneNumber', headerName: 'CHỨC VỤ', flex: 1 },
    {
      field: 'jobPosition',
      headerName: 'PHÒNG BAN',
      flex: 1,
      valueGetter: (params) => params.row.jobPosition.jobPositionName,
    },
    { field: 'currentStatus', headerName: 'PHÒNG BAN', flex: 1 },
    {
      field: 'edit',
      headerName: 'Edit',
      renderCell: (params) => (
        <button onClick={() => handleEditCandidate(params.row)} className='btn-action'>Edit</button>
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
    </Tabs>
  );

};

export default Candidate;
