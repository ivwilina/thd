import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import apiService from '../services/apiService';
import '../assets/checkout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faClock, 
  faFileText,
  faCheckCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const ServiceBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    preferredDate: '',
    preferredTime: '09:00',
    description: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Available time slots
  const timeSlots = [
    { value: '08:00', label: '08:00 - 09:00' },
    { value: '09:00', label: '09:00 - 10:00' },
    { value: '10:00', label: '10:00 - 11:00' },
    { value: '11:00', label: '11:00 - 12:00' },
    { value: '13:00', label: '13:00 - 14:00' },
    { value: '14:00', label: '14:00 - 15:00' },
    { value: '15:00', label: '15:00 - 16:00' },
    { value: '16:00', label: '16:00 - 17:00' },
    { value: '17:00', label: '17:00 - 18:00' }
  ];
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get service from location state or fetch by ID
        const serviceData = location.state?.service;
        
        if (serviceData) {
          setService(serviceData);
        } else if (serviceId) {
          const response = await apiService.getServiceById(serviceId);
          setService(response.data);
        } else {
          throw new Error('No service specified');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [location.state, serviceId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerName.trim()) {
      errors.customerName = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.customerEmail = 'Email không hợp lệ';
    }
    
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      errors.customerPhone = 'Số điện thoại không hợp lệ (10-11 số)';
    }
    
    if (!formData.customerAddress.trim()) {
      errors.customerAddress = 'Vui lòng nhập địa chỉ';
    }
    
    if (!formData.preferredDate) {
      errors.preferredDate = 'Vui lòng chọn ngày mong muốn';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.preferredDate = 'Ngày không được trong quá khứ';
      }
    }
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const bookingData = {
        serviceId: service?.id || service?._id || serviceId || 'unknown',
        serviceName: service?.name || service?.title || service?.serviceName || 'Unknown Service',
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.description // Map description to notes
      };
      
      console.log('Service object:', service); // Debug log
      console.log('Sending booking data:', bookingData); // Debug log
      
      const response = await apiService.createServiceBooking(bookingData);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate('/services', { 
            state: { 
              message: 'Đặt lịch dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.' 
            }
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating service booking:', err);
      setError('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="checkout-container">
        <NavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin dịch vụ...</p>
        </div>
      </div>
    );
  }
  
  if (error && !service) {
    return (
      <div className="checkout-container">
        <NavBar />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate('/services')}>Quay lại danh sách dịch vụ</button>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="checkout-container">
        <NavBar />
        <div className="success-container">
          <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
          <h2>Đặt lịch thành công!</h2>
          <p>Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ xác nhận sớm nhất.</p>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout-container">
      <NavBar />
      
      <main className="checkout-content">
        <div className="container">
          <div className="checkout-header">
            <h1>Đặt Lịch Dịch Vụ</h1>
            <p>Vui lòng điền thông tin để chúng tôi có thể liên hệ và hỗ trợ bạn</p>
          </div>
          
          <div className="checkout-layout">
            {/* Service Info */}
            <div className="checkout-summary">
              <h2>Thông tin dịch vụ</h2>
              
              {service && (
                <div className="service-summary">
                  <div className="service-item">
                    <h3>{service.name}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-price">
                      {service.priceMin === service.priceMax ? 
                        `${service.formattedPrice}` : 
                        `${service.formattedPriceMin} - ${service.formattedPriceMax}`
                      }
                    </div>
                    <div className="service-type">
                      Loại dịch vụ: {service.typeDisplay}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="booking-note">
                <h4>Lưu ý:</h4>
                <ul>
                  <li>Giá trên chỉ mang tính chất tham khảo</li>
                  <li>Giá chính thức sẽ được báo sau khi khảo sát</li>
                  <li>Chúng tôi sẽ liên hệ xác nhận trong 24h</li>
                  <li>Dịch vụ tận nơi trong nội thành</li>
                </ul>
              </div>
            </div>
            
            {/* Booking Form */}
            <div className="checkout-form">
              <h2>Thông tin đặt lịch</h2>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="booking-form">
                {/* Customer Information */}
                <div className="form-section">
                  <h3>Thông tin khách hàng</h3>
                  
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faUser} />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      className={formErrors.customerName ? 'error' : ''}
                    />
                    {formErrors.customerName && (
                      <span className="error-text">{formErrors.customerName}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faEnvelope} />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                      className={formErrors.customerEmail ? 'error' : ''}
                    />
                    {formErrors.customerEmail && (
                      <span className="error-text">{formErrors.customerEmail}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faPhone} />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className={formErrors.customerPhone ? 'error' : ''}
                    />
                    {formErrors.customerPhone && (
                      <span className="error-text">{formErrors.customerPhone}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Địa chỉ *
                    </label>
                    <textarea
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ chi tiết"
                      rows="3"
                      className={formErrors.customerAddress ? 'error' : ''}
                    />
                    {formErrors.customerAddress && (
                      <span className="error-text">{formErrors.customerAddress}</span>
                    )}
                  </div>
                </div>
                
                {/* Schedule Information */}
                <div className="form-section">
                  <h3>Thời gian mong muốn</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        Ngày *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={formErrors.preferredDate ? 'error' : ''}
                      />
                      {formErrors.preferredDate && (
                        <span className="error-text">{formErrors.preferredDate}</span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <FontAwesomeIcon icon={faClock} />
                        Khung giờ *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                      >
                        {timeSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="form-section">
                  <h3>Mô tả chi tiết</h3>
                  
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faFileText} />
                      Mô tả vấn đề hoặc yêu cầu
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết vấn đề cần hỗ trợ hoặc yêu cầu cụ thể..."
                      rows="4"
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate('/services')}
                    disabled={submitting}
                  >
                    Quay lại
                  </button>
                  
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đặt lịch dịch vụ'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceBooking;
