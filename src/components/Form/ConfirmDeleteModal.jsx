import React from 'react';
import Modal from 'react-modal';
import './ModalOverplay.css'
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền và độ mờ của overlay
  },
  content: {
    backgroundColor: '#fff', // Màu nền của Modal
    width: '35%', // Chiều rộng của Modal
    height: '15%', // Chiều cao của Modal
    margin: 'auto',
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderRadius: '.25rem',
    paddingTop: '15px',
    marginTop: '10px',

  },

  deleteButton: {
    padding: '7px 10px',
    backgroundColor: '#5a5279',  
    color: 'white',  
    border: '1px solid transparent',
    borderRadius: '.25rem',
    
  },
  cancelButton: {
    padding: '7px 10px',
    border: '1px solid transparent',
    borderRadius: '.25rem',
    marginRight: '15px'
  }
};

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onCancel} contentLabel="Xác nhận xóa" style={customStyles}>
        <h2>Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa không?</p>
        <div style={customStyles.button}>
          <button onClick={onCancel} style={customStyles.cancelButton}>Hủy</button>
          <button onClick={onConfirm} style={customStyles.deleteButton}>Xóa</button>
        </div>
      </Modal>
    </div>
  );
};


export default ConfirmDeleteModal;
