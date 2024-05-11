import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import './UpdateStatusModal.css'
const UpdateStatusModal = ({ open, onClose, onUpdate, candidate, selectedCandidate }) => {
  const [newStatus, setNewStatus] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [secondInterviewTime, setSecondInterviewTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noteContract, setNoteContract] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [identityCardNumber, setIdentityCardNumber] = useState('');

  useEffect(() => {
    if (candidate) {
      setNewStatus(getNextStatus(candidate.currentStatus));
    }
  }, [candidate]);
  const [previousCandidate, setPreviousCandidate] = useState(null);

  useEffect(() => {
    if (selectedCandidate !== previousCandidate) {
      setInterviewTime(''); 
      setSecondInterviewTime('');  
      setPreviousCandidate(selectedCandidate);
    }
  }, [selectedCandidate]);


  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'NEW': return ['INITIAL_REVIEW', 'REFUSE'];
      case 'INITIAL_REVIEW': return ['FIRST_INTERVIEW', 'REFUSE'];
      case 'FIRST_INTERVIEW': return ['SECOND_INTERVIEW', 'REFUSE'];
      case 'SECOND_INTERVIEW': return ['OFFER_MADE', 'REFUSE'];
      case 'OFFER_MADE': return ['CONTRACT_SIGNED', 'REFUSE'];
      default: return '';
    }
  };

  const handleUpdate = () => {
    if (candidate) {
      const formattedInterviewTime = `${interviewTime}:00`;
      const formattedSecondInterviewTime = `${secondInterviewTime}:00`;

      onUpdate(candidate.id, newStatus, formattedInterviewTime, formattedSecondInterviewTime, startDate, endDate, noteContract, monthlySalary, identityCardNumber);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật trạng thái</DialogTitle>
      <DialogContent>
        {candidate && (
          <>
            {getNextStatus(candidate.currentStatus).map(status => (
              <FormControlLabel
                key={status}
                control={<Checkbox checked={newStatus === status} onChange={() => setNewStatus(status)} />}
                label={status}
              />
            ))}
            <br />
            {(newStatus === 'FIRST_INTERVIEW') && (
              <TextField
                label="Thời gian phỏng vấn"
                type="datetime-local"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}

            {newStatus === 'SECOND_INTERVIEW' && (
              <TextField
                label="Thời gian phỏng vấn lần 2"
                type="datetime-local"
                value={secondInterviewTime}
                onChange={(e) => setSecondInterviewTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {newStatus === 'OFFER_MADE' && (
              <>
                <TextField
                  className="offer-field"
                  label="Ngày bắt đầu"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  className="offer-field"
                  label="Ngày kết thúc"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <br />
                <TextField
                  className="offer-field"
                  label="Lương hàng tháng"
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                />
                <TextField
                  className="offer-field"
                  label="Ghi chú hợp đồng"
                  value={noteContract}
                  onChange={(e) => setNoteContract(e.target.value)}
                />
              </>
            )}

            {newStatus === 'CONTRACT_SIGNED' && (
              <TextField
                label="Số chứng minh nhân dân"
                value={identityCardNumber}
                onChange={(e) => setIdentityCardNumber(e.target.value)}
              />
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Hủy</Button>
        <Button onClick={handleUpdate} color="primary">Cập nhật</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusModal;
