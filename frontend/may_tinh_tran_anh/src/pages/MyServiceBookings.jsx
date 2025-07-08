import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import apiService from '../services/apiService';
import '../assets/checkout.css';
import '../assets/serviceBookingHistory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faFileText,
  faCheckCircle,
  faHourglassHalf,
  faCog,
  faTimes,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const MyServiceBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Status display mapping
  const statusDisplay = {
    'pending': { text: 'Đã đặt', icon: faHourglassHalf, class: 'status-pending' },
    'confirmed': { text: 'Đã xác nhận', icon: faCheckCircle, class: 'status-confirmed' },
    'in-progress': { text: 'Đang thực hiện', icon: faCog, class: 'status-progress' },
    'completed': { text: 'Hoàn thành', icon: faCheckCircle, class: 'status-completed' },
    'cancelled': { text: 'Đã hủy', icon: faTimes, class: 'status-cancelled' }
  };

  useEffect(() => {
    if (searchEmail || searchPhone) {
      fetchBookings();
    }
  }, [searchEmail, searchPhone, selectedStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let allBookings = [];
      
      if (searchEmail) {
        const response = await apiService.get(`/service-bookings?customerEmail=${encodeURIComponent(searchEmail)}`);
        allBookings = response.bookings || [];
      } else if (searchPhone) {
        const response = await apiService.get(`/service-bookings?customerPhone=${encodeURIComponent(searchPhone)}`);
        allBookings = response.bookings || [];
      }
      
      // Filter by status if selected
      if (selectedStatus !== 'all') {
        allBookings = allBookings.filter(booking => booking.status === selectedStatus);
      }
      
      setBookings(allBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchEmail && !searchPhone) {
      setError('Vui lòng nhập email hoặc số điện thoại để tìm kiếm');
      return;
    }
    fetchBookings();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <div className="checkout-container">
      <NavBar />
      
      <main className="checkout-content">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Trang chủ</a> / <span>Lịch sử đặt dịch vụ</span>
          </div>

          <div className="checkout-header">
            <h1>Lịch sử đặt dịch vụ</h1>
            <p>Tìm kiếm và xem lại các dịch vụ bạn đã đặt</p>
          </div>

          {/* Search Form */}
          <div className="booking-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="searchEmail">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Email đã đặt
                  </label>
                  <input
                    type="email"
                    id="searchEmail"
                    value={searchEmail}
                    onChange={(e) => {
                      setSearchEmail(e.target.value);
                      setSearchPhone(''); // Clear phone when email is entered
                    }}
                    placeholder="Nhập email bạn đã sử dụng khi đặt dịch vụ"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="searchPhone">
                    <FontAwesomeIcon icon={faPhone} />
                    Hoặc số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="searchPhone"
                    value={searchPhone}
                    onChange={(e) => {
                      setSearchPhone(e.target.value);
                      setSearchEmail(''); // Clear email when phone is entered
                    }}
                    placeholder="Nhập số điện thoại bạn đã sử dụng"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="statusFilter">Trạng thái</label>
                  <select
                    id="statusFilter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Đã đặt</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn-search">
                    <FontAwesomeIcon icon={faSearch} />
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (searchEmail || searchPhone) && (
            <div className="booking-results">
              <h2>
                Kết quả tìm kiếm 
                {searchEmail && <span> cho email: <strong>{searchEmail}</strong></span>}
                {searchPhone && <span> cho số điện thoại: <strong>{searchPhone}</strong></span>}
              </h2>
              
              {bookings.length === 0 ? (
                <div className="no-bookings">
                  <p>Không tìm thấy dịch vụ nào đã đặt với thông tin này.</p>
                  <p>Vui lòng kiểm tra lại email hoặc số điện thoại.</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <h3 className="service-name">{booking.serviceName}</h3>
                        <div className={`booking-status ${statusDisplay[booking.status]?.class}`}>
                          <FontAwesomeIcon icon={statusDisplay[booking.status]?.icon} />
                          {statusDisplay[booking.status]?.text}
                        </div>
                      </div>
                      
                      <div className="booking-details">
                        <div className="detail-row">
                          <div className="detail-item">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>Ngày đặt: {formatDate(booking.preferredDate)}</span>
                          </div>
                          <div className="detail-item">
                            <FontAwesomeIcon icon={faClock} />
                            <span>Thời gian: {formatTime(booking.preferredTime)}</span>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <div className="detail-item">
                            <FontAwesomeIcon icon={faUser} />
                            <span>Khách hàng: {booking.customerName}</span>
                          </div>
                          <div className="detail-item">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>Email: {booking.customerEmail}</span>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <div className="detail-item">
                            <FontAwesomeIcon icon={faPhone} />
                            <span>Điện thoại: {booking.customerPhone}</span>
                          </div>
                          {booking.customerAddress && (
                            <div className="detail-item">
                              <FontAwesomeIcon icon={faMapMarkerAlt} />
                              <span>Địa chỉ: {booking.customerAddress}</span>
                            </div>
                          )}
                        </div>
                        
                        {booking.notes && (
                          <div className="detail-row">
                            <div className="detail-item full-width">
                              <FontAwesomeIcon icon={faFileText} />
                              <span>Ghi chú: {booking.notes}</span>
                            </div>
                          </div>
                        )}
                        
                        {booking.staffNotes && (
                          <div className="detail-row">
                            <div className="detail-item full-width staff-notes">
                              <FontAwesomeIcon icon={faFileText} />
                              <span>Ghi chú từ nhân viên: {booking.staffNotes}</span>
                            </div>
                          </div>
                        )}
                        
                        {booking.finalPrice && (
                          <div className="detail-row">
                            <div className="detail-item">
                              <strong>Giá cuối cùng: {booking.finalPrice?.toLocaleString()} VNĐ</strong>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="booking-footer">
                        <small>Mã đặt lịch: {booking._id}</small>
                        <small>Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !error && !searchEmail && !searchPhone && (
            <div className="search-instruction">
              <h2>Cách tìm kiếm dịch vụ đã đặt</h2>
              <p>Vui lòng nhập <strong>email</strong> hoặc <strong>số điện thoại</strong> bạn đã sử dụng khi đặt dịch vụ để xem lịch sử.</p>
              <div className="instruction-steps">
                <div className="step">
                  <h3>1. Nhập thông tin</h3>
                  <p>Điền email hoặc số điện thoại đã sử dụng khi đặt dịch vụ</p>
                </div>
                <div className="step">
                  <h3>2. Chọn trạng thái (tùy chọn)</h3>
                  <p>Lọc theo trạng thái cụ thể hoặc xem tất cả</p>
                </div>
                <div className="step">
                  <h3>3. Nhấn tìm kiếm</h3>
                  <p>Xem danh sách các dịch vụ đã đặt</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyServiceBookings;
