import React, { useState, useEffect } from 'react';
import '../assets/unifiedAdminStaff.css';

const AccountFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  account = null 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (account && account.id) {
        // Edit mode
        setFormData({
          username: account.username || '',
          password: '', // Don't show existing password
          name: account.fullName || account.name || '',
          email: account.email || '',
          phone: account.phone || '',
          role: account.role || 'staff',
          status: account.status || 'active'
        });
      } else {
        // Add mode
        setFormData({
          username: '',
          password: '',
          name: '',
          email: '',
          phone: '',
          role: 'staff',
          status: 'active'
        });
      }
      setErrors({});
    }
  }, [isOpen, account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username?.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!account?.id && !formData.password?.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving account:', error);
      setErrors({ general: 'Có lỗi xảy ra khi lưu tài khoản. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content account-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {account?.id ? '✏️ Chỉnh sửa tài khoản' : '➕ Thêm tài khoản mới'}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Tên đăng nhập *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label>{account?.id ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={account?.id ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="manager">Quản lý</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : (account?.id ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountFormModal;
