import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo: hardcoded staff login, replace with real API in production
    if (username === 'staff' && password === '123456') {
      localStorage.setItem('isStaffLoggedIn', 'true');
      navigate('/staff/orders');
    } else {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập nhân viên</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Đăng nhập</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;