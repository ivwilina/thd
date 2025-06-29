import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/serviceListing.css';
import NavBar from '../components/NavBar';
import apiService from '../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWrench, 
  faCog, 
  faDownload, 
  faComments, 
  faHourglassHalf,
  faCheck,
  faStar
} from '@fortawesome/free-solid-svg-icons';

const ServiceListing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  // Service type icons mapping
  const serviceIcons = {
    'repair': faWrench,
    'maintenance': faCog,
    'installation': faDownload,
    'consultation': faComments,
    'rental': faHourglassHalf
  };

  // Service type display names
  const serviceTypeNames = {
    'repair': 'Sửa chữa',
    'maintenance': 'Bảo trì',
    'installation': 'Cài đặt',
    'consultation': 'Tư vấn',
    'rental': 'Cho thuê'
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (selectedType === 'all') {
          response = await apiService.getServices();
        } else {
          response = await apiService.getServicesByType(selectedType);
        }
        
        const formattedServices = response.data?.map(service => 
          apiService.formatServiceForDisplay(service)
        ) || [];
        
        setServices(formattedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedType]);

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {});

  return (
    <div className="service-listing-container">
      <NavBar />
      
      <main className="service-listing-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Dịch vụ</span>
          </div>
          
          <h1 className="page-title">Dịch Vụ Máy Tính</h1>
          <p className="page-subtitle">
            Chúng tôi cung cấp đầy đủ các dịch vụ chuyên nghiệp cho máy tính và thiết bị của bạn
          </p>
          
          {/* Service Type Filter */}
          <div className="service-filters">
            <button 
              className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => handleTypeFilter('all')}
            >
              Tất cả dịch vụ
            </button>
            {Object.keys(serviceTypeNames).map(type => (
              <button 
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => handleTypeFilter(type)}
              >
                <FontAwesomeIcon icon={serviceIcons[type]} />
                {serviceTypeNames[type]}
              </button>
            ))}
          </div>

          {/* Services Content */}
          {loading ? (
            <div className="loading">Đang tải dịch vụ...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Thử lại</button>
            </div>
          ) : services.length === 0 ? (
            <div className="no-services">
              <p>Không có dịch vụ nào được tìm thấy.</p>
            </div>
          ) : (
            <div className="services-content">
              {selectedType === 'all' ? (
                // Group services by type when showing all
                Object.keys(groupedServices).map(type => (
                  <div key={type} className="service-group">
                    <h2 className="service-group-title">
                      <FontAwesomeIcon icon={serviceIcons[type]} />
                      {serviceTypeNames[type]}
                    </h2>
                    <div className="service-grid">
                      {groupedServices[type].map(service => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Show services in grid when filtered by type
                <div className="service-grid">
                  {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      {service.isFeatured && (
        <div className="featured-badge">
          <FontAwesomeIcon icon={faStar} />
          Nổi bật
        </div>
      )}
      
      <div className="service-header">
        <h3 className="service-name">{service.name}</h3>
        <div className="service-price">{service.price}</div>
      </div>
      
      <div className="service-description">
        {service.description}
      </div>
      
      <div className="service-features">
        <div className="feature-item">
          <FontAwesomeIcon icon={faCheck} />
          Bảo hành chất lượng
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faCheck} />
          Kỹ thuật viên chuyên nghiệp
        </div>
        <div className="feature-item">
          <FontAwesomeIcon icon={faCheck} />
          Hỗ trợ tận nơi
        </div>
      </div>
      
      <div className="service-actions">
        <button className="btn-contact">
          Liên hệ tư vấn
        </button>
        <button className="btn-book">
          Đặt lịch
        </button>
      </div>
    </div>
  );
};

export default ServiceListing;
