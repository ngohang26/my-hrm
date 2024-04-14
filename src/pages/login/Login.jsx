import React, { useState } from 'react';

const Login=() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi đăng nhập');
      }

      const data = await response.json();

      // Lưu accessToken vào localStorage hoặc context để sử dụng cho các yêu cầu sau
      localStorage.setItem('accessToken', data.accessToken);
    } catch (error) {
      console.error('Lỗi đăng nhập', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tên đăng nhập:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Mật khẩu:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Đăng nhập</button>
    </form>
  );
}

export default Login;
