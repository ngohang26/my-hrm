import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {apiUrl} from '../../config'

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');  
  const [message, setMessage] = useState('');  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username) {
      setError('Yêu cầu nhập username');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/reset-password/${username}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const errorData = await response.text(); 
        setError(errorData); 
        throw new Error('Lỗi đặt lại mật khẩu');
      }

      const data = await response.text();
      setMessage(data);  
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu', error);
    }
  };

  const handleCancel = () => {
    navigate('/');  
  };

  return (
    <div>
      <h1>Quên mật khẩu</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        {error && <p>{error}</p>}  
        {message && <p>{message}</p>}  
        <button type="submit">Gửi</button>
        <button type="button" onClick={handleCancel}>Hủy</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
