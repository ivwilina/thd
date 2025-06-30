import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import AccountFormModal from '../components/AccountFormModal';
import '../assets/unifiedAdminStaff.css';

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  // Load accounts on component mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployees();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load accounts:', err);
      setError('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      return;
    }

    try {
      await apiService.deleteEmployee(accountId);
      await loadAccounts(); // Reload the list
      alert('Xóa tài khoản thành công!');
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Lỗi khi xóa tài khoản: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveAccount = async (accountData) => {
    try {
      if (editingAccount) {
        // Update existing account
        await apiService.updateEmployee(editingAccount._id, accountData);
        alert('Cập nhật tài khoản thành công!');
      } else {
        // Create new account
        await apiService.createEmployee(accountData);
        alert('Thêm tài khoản thành công!');
      }
      
      setShowModal(false);
      setEditingAccount(null);
      await loadAccounts(); // Reload the list
    } catch (err) {
      console.error('Failed to save account:', err);
      alert('Lỗi khi lưu tài khoản: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filter accounts based on search and role
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || account.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <h3>⚠️ Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button onClick={loadAccounts} className="btn btn-primary">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header Section */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý tài khoản</h1>
          <div className="admin-breadcrumb">
            Admin / Quản lý tài khoản
          </div>
        </div>
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleAddAccount}
        >
          + Thêm tài khoản
        </button>
      </div>

      <div className="admin-main-content">
        {/* Search and filter controls */}
        <div className="controls-section">
          <div className="controls-row">
            <div className="search-box">
              <label className="form-label">Tìm kiếm</label>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, mã nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-box">
              <label className="form-label">Lọc theo vai trò</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accounts summary */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon">👥</div>
            <div className="stats-value">{accounts.length}</div>
            <div className="stats-label">Tổng số tài khoản</div>
          </div>
          <div className="stats-card">
            <div className="stats-icon">👀</div>
            <div className="stats-value">{filteredAccounts.length}</div>
            <div className="stats-label">Đang hiển thị</div>
          </div>
          <div className="stats-card">
            <div className="stats-icon">✅</div>
            <div className="stats-value">{accounts.filter(a => a.status === 'active').length}</div>
            <div className="stats-label">Tài khoản hoạt động</div>
          </div>
        </div>

        {/* Accounts table */}
        <div className="card">
          <div className="card-header">
            <h3 style={{margin: 0}}>Danh sách tài khoản ({filteredAccounts.length})</h3>
          </div>
          <div className="card-body" style={{padding: 0}}>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        Không có tài khoản nào được tìm thấy
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account._id}>
                        <td><strong>{account.employeeId}</strong></td>
                        <td>{account.fullName}</td>
                        <td>{account.email}</td>
                        <td>
                          <span className={`role-badge role-${account.role}`}>
                            {account.role === 'admin' ? 'Admin' : 
                             account.role === 'staff' ? 'Staff' : 
                             account.role === 'manager' ? 'Manager' : account.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${account.status}`}>
                            {account.status === 'active' ? 'Hoạt động' : 
                             account.status === 'inactive' ? 'Không hoạt động' : account.status}
                          </span>
                        </td>
                        <td>
                          {account.createdAt ? new Date(account.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn action-btn-edit"
                              onClick={() => handleEditAccount(account)}
                              title="Chỉnh sửa"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn action-btn-delete"
                              onClick={() => handleDeleteAccount(account._id)}
                              title="Xóa"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Account form modal */}
      {showModal && (
        <AccountFormModal
          account={editingAccount}
          onSave={handleSaveAccount}
          onCancel={() => {
            setShowModal(false);
            setEditingAccount(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminAccounts;
