import React, { useState } from 'react';
import './Login.css'
import { TbBrand4Chan } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config'
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [error, setError] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsCheckingToken(true);

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
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
        const errorData = await response.json();
        setError({ ...error, [errorData.field]: errorData.message });
        throw new Error('Lỗi đăng nhập');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      window.location.reload();
      // navigate('/hrm/dashboard');

    } catch (error) {
      console.error('Lỗi đăng nhập', error);
    } finally {
      setIsCheckingToken(false);
    }
  };

  return (
    <HelmetProvider>

      <div className="login-container">
        <Helmet>
          <title>Đăng nhập</title>
        </Helmet>
        <div className="gray-section">
          <img src='/hrm.png'></img>
        </div>
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <a href="/login" className='logo-login'><TbBrand4Chan className='logo' /></a>
            <div className='card-title'>Đăng nhập tài khoản của bạn</div>

            <div className='form-div'>Tên tài khoản/ Mã nhân viên</div>
            <label>
              <input className={`form-control ${error.username ? 'input-error' : ''}`} type="text" value={username} placeholder='Nhập tên tài khoản' onChange={e => { setUsername(e.target.value); setError({ ...error, username: '' }) }} />
              {error.username && <p>{error.username}</p>}
            </label>
            <div className='form-div'>Mật khẩu</div>

            <label>
              <input className={`form-control ${error.password ? 'input-error' : ''}`} type="password" value={password} placeholder='Nhập mật khẩu' onChange={e => { setPassword(e.target.value); setError({ ...error, password: '' }) }} />
              {error.password && <p>{error.password}</p>}
            </label>
            <a class="float-right small" href="/forgotpassword">Quên mật khẩu?</a>
            <br />
            <button type="submit">Đăng nhập</button>
          </form>
          <div className='form-div'>Nếu bạn chưa có tài khảo hãy liên hệ với quản lý của bạn!</div>
        </div>
        <div className="purple-section"></div>
      </div>
    </HelmetProvider>
  );
}

export default Login;
