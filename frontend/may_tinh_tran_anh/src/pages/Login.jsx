import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Demo credentials - replace with real API authentication in production
      if (username === 'staff' && password === '123456') {
        // Staff login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'staff');
        localStorage.setItem('userName', 'Nhân viên');
        localStorage.setItem('userId', 'staff-001');
        navigate('/staff/orders');
      } else if (username === 'admin' && password === 'admin123') {
        // Admin login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Quản trị viên');
        localStorage.setItem('userId', 'admin-001');
        navigate('/admin/products');
      } else {
        setError('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 Đăng nhập hệ thống</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        
        <div className="demo-accounts">
          <h4>🧪 Tài khoản demo:</h4>
          <div className="account-info">
            <strong>👤 Nhân viên:</strong> staff / 123456
            <br />
            <small>Quản lý đơn hàng và tồn kho</small>
          </div>
          <div className="account-info">
            <strong>👨‍💼 Quản trị:</strong> admin / admin123
            <br />
            <small>Quản lý sản phẩm, kho hàng, tài khoản</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;