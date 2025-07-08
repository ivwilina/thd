import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faEdit,
  faCheck,
  faTimes,
  faEye,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import apiService from '../services/apiService';
import StaffNavBar from '../components/StaffNavBar';
import '../assets/staffServiceBookingsScoped.css';

const StaffServiceBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({});

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Đã đặt', color: '#ffc107', icon: faCalendarAlt },
    { value: 'confirmed', label: 'Đã xác nhận', color: '#17a2b8', icon: faCheck },
    { value: 'in-progress', label: 'Đang thực hiện', color: '#007bff', icon: faSpinner },
    { value: 'completed', label: 'Hoàn thành', color: '#28a745', icon: faCheck },
    { value: 'cancelled', label: 'Đã hủy', color: '#dc3545', icon: faTimes }
  ];

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : '#6c757d';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (filter !== 'all') {
          params.status = filter;
        }

        const bookingsData = await apiService.getServiceBookings(params);
        setBookings(bookingsData);

        const response = await apiService.getServiceBookingStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }

      const bookingsData = await apiService.getServiceBookings(params);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getServiceBookingStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus, updates = {}) => {
    try {
      setUpdating(true);

      await apiService.updateServiceBookingStatus(bookingId, newStatus, updates);
      
      // Refresh bookings
      await fetchBookings();
      await fetchStats();
      
      setShowModal(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  return (
    <div className="staff-service-container">
      <StaffNavBar />
      <div className="staff-service-content">
        <div className="staff-service-header">
          <h1>
            <FontAwesomeIcon icon={faCalendarAlt} />
            Quản lý đặt lịch dịch vụ
          </h1>
          
          {/* Statistics */}
          <div className="staff-service-stats">
            <div className="staff-service-stat-card">
              <div className="staff-service-stat-number">{stats.total || 0}</div>
              <div className="staff-service-stat-label">Tổng đặt lịch</div>
            </div>
            <div className="staff-service-stat-card staff-service-pending">
              <div className="staff-service-stat-number">{stats.pending || 0}</div>
              <div className="staff-service-stat-label">Đã đặt</div>
            </div>
            <div className="staff-service-stat-card staff-service-confirmed">
              <div className="staff-service-stat-number">{stats.confirmed || 0}</div>
              <div className="staff-service-stat-label">Đã xác nhận</div>
            </div>
            <div className="staff-service-stat-card staff-service-completed">
              <div className="staff-service-stat-number">{stats.completed || 0}</div>
              <div className="staff-service-stat-label">Hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="staff-service-filter-tabs">
          <button 
            className={`staff-service-filter-btn ${filter === 'all' ? 'staff-service-filter-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({stats.total || 0})
          </button>
          {statusOptions.map(status => (
            <button
              key={status.value}
              className={`staff-service-filter-btn ${filter === status.value ? 'staff-service-filter-active' : ''}`}
              onClick={() => setFilter(status.value)}
              data-status={status.value}
            >
              <FontAwesomeIcon icon={status.icon} />
              {status.label} ({stats[status.value] || 0})
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="staff-service-error-message">
            {error}
            <button onClick={fetchBookings}>Thử lại</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="staff-service-loading-container">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Đang tải danh sách đặt lịch...</p>
          </div>
        ) : (
          <>
            {/* Bookings List */}
            <div className="staff-service-bookings-list">
              {filteredBookings.length === 0 ? (
                <div className="staff-service-no-bookings">
                  <p>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '2rem', marginBottom: '1rem', color: '#6c757d' }} />
                  </p>
                  <p>Không có đặt lịch nào {filter !== 'all' ? `với trạng thái "${getStatusLabel(filter)}"` : ''}.</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Vui lòng chọn trạng thái khác hoặc kiểm tra lại sau.</p>
                </div>
              ) : (
                filteredBookings.map(booking => (
                  <BookingCard 
                    key={booking._id} 
                    booking={booking} 
                    onView={handleViewBooking}
                    onUpdateStatus={handleUpdateStatus}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Booking Detail Modal */}
        {showModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={() => {
              setShowModal(false);
              setSelectedBooking(null);
            }}
            onUpdateStatus={handleUpdateStatus}
            statusOptions={statusOptions}
            updating={updating}
          />
        )}
      </div>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onView, onUpdateStatus, getStatusColor, getStatusLabel }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    return `${timeString} - ${parseInt(timeString.split(':')[0]) + 1}:00`;
  };

  // Define status icons map directly in the component
  const statusIconsMap = {
    'pending': faCalendarAlt,
    'confirmed': faCheck,
    'in-progress': faSpinner,
    'completed': faCheck,
    'cancelled': faTimes
  };

  const getStatusIcon = (status) => {
    return statusIconsMap[status] || faCalendarAlt;
  };

  return (
    <div className="staff-service-booking-card" data-status={booking.status}>
      <div className="staff-service-card-header">
        <div className="staff-service-booking-info">
          <h3>{booking.serviceId?.name || 'Dịch vụ'}</h3>
          <p className="staff-service-booking-id">#{booking._id}</p>
        </div>
        <div 
          className="staff-service-status-badge"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        >
          <FontAwesomeIcon icon={getStatusIcon(booking.status)} />
          {getStatusLabel(booking.status)}
        </div>
      </div>

      <div className="staff-service-booking-details">
        <div className="staff-service-detail-row">
          <FontAwesomeIcon icon={faUser} />
          <span>{booking.customerName}</span>
        </div>
        <div className="staff-service-detail-row">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>{booking.customerEmail}</span>
        </div>
        <div className="staff-service-detail-row">
          <FontAwesomeIcon icon={faPhone} />
          <span>{booking.customerPhone}</span>
        </div>
        <div className="staff-service-detail-row">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>{formatDate(booking.preferredDate)} - {formatTime(booking.preferredTime)}</span>
        </div>
        {booking.estimatedPrice && (
          <div className="staff-service-detail-row">
            <span className="staff-service-price">Giá ước tính: {booking.estimatedPrice.toLocaleString('vi-VN')}đ</span>
          </div>
        )}
      </div>

      <div className="staff-service-card-actions">
        <button className="staff-service-btn-view" onClick={() => onView(booking)}>
          <FontAwesomeIcon icon={faEye} />
          Chi tiết
        </button>
        
        {booking.status === 'pending' && (
          <button 
            className="staff-service-btn-confirm"
            onClick={() => onUpdateStatus(booking._id, 'confirmed')}
          >
            <FontAwesomeIcon icon={faCheck} />
            Xác nhận
          </button>
        )}
        
        {booking.status === 'confirmed' && (
          <button 
            className="staff-service-btn-progress"
            onClick={() => onUpdateStatus(booking._id, 'in-progress')}
          >
            <FontAwesomeIcon icon={faSpinner} />
            Bắt đầu
          </button>
        )}
        
        {booking.status === 'in-progress' && (
          <button 
            className="staff-service-btn-complete"
            onClick={() => onUpdateStatus(booking._id, 'completed')}
          >
            <FontAwesomeIcon icon={faCheck} />
            Hoàn thành
          </button>
        )}
        
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <button 
            className="staff-service-btn-cancel"
            onClick={() => onUpdateStatus(booking._id, 'cancelled')}
          >
            <FontAwesomeIcon icon={faTimes} />
            Hủy
          </button>
        )}
      </div>
    </div>
  );
};

// Booking Detail Modal Component
const BookingDetailModal = ({ booking, onClose, onUpdateStatus, statusOptions, updating }) => {
  const [status, setStatus] = useState(booking.status);
  const [staffNotes, setStaffNotes] = useState(booking.staffNotes || '');
  const [finalPrice, setFinalPrice] = useState(booking.finalPrice || '');

  const handleUpdate = () => {
    const updates = {};
    if (staffNotes !== booking.staffNotes) updates.staffNotes = staffNotes;
    if (finalPrice && finalPrice !== booking.finalPrice) updates.finalPrice = parseFloat(finalPrice);
    
    onUpdateStatus(booking._id, status, updates);
  };

  return (
    <div className="staff-service-modal-overlay">
      <div className="staff-service-modal-content">
        <div className="staff-service-modal-header">
          <h2>Chi tiết đặt lịch #{booking._id}</h2>
          <button className="staff-service-btn-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="staff-service-modal-body">
          <div className="staff-service-booking-info-grid">
            <div className="staff-service-info-section">
              <h3><FontAwesomeIcon icon={faCalendarAlt} /> Thông tin dịch vụ</h3>
              <p><strong>Dịch vụ:</strong> {booking.serviceId?.name}</p>
              <p><strong>Loại:</strong> {booking.serviceId?.type}</p>
              <p><strong>Mô tả:</strong> {booking.serviceId?.description}</p>
            </div>

            <div className="staff-service-info-section">
              <h3><FontAwesomeIcon icon={faUser} /> Thông tin khách hàng</h3>
              <p><FontAwesomeIcon icon={faUser} /> {booking.customerName}</p>
              <p><FontAwesomeIcon icon={faEnvelope} /> {booking.customerEmail}</p>
              <p><FontAwesomeIcon icon={faPhone} /> {booking.customerPhone}</p>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {booking.customerAddress}</p>
            </div>

            <div className="staff-service-info-section">
              <h3><FontAwesomeIcon icon={faClock} /> Thời gian</h3>
              <p><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(booking.preferredDate).toLocaleDateString('vi-VN')}</p>
              <p><FontAwesomeIcon icon={faClock} /> {booking.preferredTime}</p>
              <p><strong>Ngày tạo:</strong> {new Date(booking.createdAt).toLocaleString('vi-VN')}</p>
            </div>

            {booking.description && (
              <div className="staff-service-info-section">
                <h3><FontAwesomeIcon icon={faEdit} /> Mô tả yêu cầu</h3>
                <p>{booking.description}</p>
              </div>
            )}
          </div>

          <div className="staff-service-update-section">
            <h3><FontAwesomeIcon icon={faEdit} /> Cập nhật trạng thái</h3>
            
            <div className="staff-service-form-group">
              <label>Trạng thái:</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="staff-service-form-group">
              <label>Ghi chú của nhân viên:</label>
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                rows="3"
                placeholder="Nhập ghi chú, cập nhật tiến độ..."
              />
            </div>

            <div className="staff-service-form-group">
              <label>Giá cuối cùng (VNĐ):</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="Nhập giá cuối cùng sau khi khảo sát"
              />
            </div>
          </div>
        </div>

        <div className="staff-service-modal-actions">
          <button className="staff-service-btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button 
            className="staff-service-btn-primary" 
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Đang cập nhật...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEdit} />
                Cập nhật
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffServiceBookings;
