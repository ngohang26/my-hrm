import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');
  const [isCheckingToken, setIsCheckingToken] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate('/', { state: { from: location } });
    } else {
      setIsCheckingToken(true);
      fetch('http://localhost:8080/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: accessToken,
      })
      
        .then(response => response.json())
        .then(data => {
          if (!data) {
            localStorage.removeItem('accessToken');
            navigate('/', { state: { from: location } });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsCheckingToken(false);
        });
    }
  }, [accessToken]);

  if (!accessToken || isCheckingToken) {
    return null;
  }

  return children;
}
