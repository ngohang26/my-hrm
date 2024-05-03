import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/login/Login'
function AuthHandler() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken) {
      navigate('/hrm/dashboard');
    }
  }, [accessToken]);

  if (accessToken) {
    return null;
  }

  return <Login />;
}

export default AuthHandler