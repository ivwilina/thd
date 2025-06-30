import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import ProductFormModal from '../components/ProductFormModal';
import '../assets/unifiedAdminStaff.css';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-brand">
        <h3>👨‍💼 {userName}</h3>
      </div>
      <div className="admin-nav-links">
        <Link to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>
          📦 Sản phẩm
        </Link>
        <Link to="/admin/inventory" className={location.pathname === '/admin/inventory' ? 'active' : ''}>
          🏪 Kho hàng
        </Link>
        <Link to="/admin/accounts" className={location.pathname === '/admin/accounts' ? 'active' : ''}>
          👥 Tài khoản
        </Link>
        <Link to="/admin/reports" className={location.pathname === '/admin/reports' ? 'active' : ''}>
          📊 Báo cáo
        </Link>
      </div>
      <button className="admin-logout-btn" onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
    </nav>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState({ laptops: [], printers: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('laptops');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [laptopsRes, printersRes, servicesRes] = await Promise.all([
        apiService.get('/laptops?limit=50'),
        apiService.get('/printers?limit=50'),
        apiService.get('/services?limit=50')
      ]);

      setProducts({
        laptops: laptopsRes.laptops || [],
        printers: printersRes.printers || [],
        services: servicesRes.services || []
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productType, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      switch (productType) {
        case 'laptop':
          await apiService.deleteLaptop(id);
          break;
        case 'printer':
          await apiService.deletePrinter(id);
          break;
        case 'service':
          await apiService.deleteService(id);
          break;
      }
      
      setSuccess('Xóa sản phẩm thành công!');
      setTimeout(() => setSuccess(null), 3000);
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Không thể xóa sản phẩm.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (productType, product) => {
    setEditingProduct({ ...product, productType });
    setShowEditModal(true);
  };

  const handleAdd = (productType) => {
    setEditingProduct({ productType });
    setShowAddModal(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      
      if (showEditModal && editingProduct._id) {
        // Update existing product
        switch (formData.productType) {
          case 'laptop':
            await apiService.updateLaptop(editingProduct._id, formData);
            break;
          case 'printer':
            await apiService.updatePrinter(editingProduct._id, formData);
            break;
          case 'service':
            await apiService.updateService(editingProduct._id, formData);
            break;
        }
        setSuccess('Cập nhật sản phẩm thành công!');
      } else {
        // Create new product
        switch (formData.productType) {
          case 'laptop':
            await apiService.createLaptop(formData);
            break;
          case 'printer':
            await apiService.createPrinter(formData);
            break;
          case 'service':
            await apiService.createService(formData);
            break;
        }
        setSuccess('Thêm sản phẩm mới thành công!');
      }

      setTimeout(() => setSuccess(null), 3000);
      setShowAddModal(false);
      setShowEditModal(false);
      fetchProducts(); // Refresh list
      
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Không thể lưu sản phẩm. Vui lòng thử lại.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { text: 'Hoạt động', class: 'status-active' },
      'inactive': { text: 'Không hoạt động', class: 'status-inactive' },
      'draft': { text: 'Bản nháp', class: 'status-draft' }
    };
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const LaptopsList = () => (
    <div className="products-list">
      <div className="products-header">
        <h3>💻 Danh sách Laptop ({products.laptops.length})</h3>
        <button className="btn-primary" onClick={() => handleAdd('laptop')}>
          ➕ Thêm laptop mới
        </button>
      </div>
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Giá bán</th>
              <th>Giảm giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.laptops.map((laptop) => (
              <tr key={laptop._id}>
                <td>
                  <img 
                    src={laptop.images?.[0] ? `http://localhost:3000/uploads/${laptop.images[0]}` : '/placeholder-laptop.jpg'} 
                    alt={laptop.name}
                    className="product-thumbnail"
                  />
                </td>
                <td>
                  <div className="product-name">{laptop.name}</div>
                  <div className="product-model">{laptop.model}</div>
                </td>
                <td>{laptop.brand?.name || 'N/A'}</td>
                <td className="price">{formatPrice(laptop.price)}</td>
                <td>{laptop.discount ? `${laptop.discount}%` : 'Không'}</td>
                <td>{getStatusBadge(laptop.status || 'active')}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit('laptop', laptop)}
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete('laptop', laptop._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PrintersList = () => (
    <div className="products-list">
      <div className="products-header">
        <h3>🖨️ Danh sách Printer ({products.printers.length})</h3>
        <button className="btn-primary" onClick={() => handleAdd('printer')}>
          ➕ Thêm printer mới
        </button>
      </div>
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Giá bán</th>
              <th>Loại in</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.printers.map((printer) => (
              <tr key={printer._id}>
                <td>
                  <img 
                    src={printer.images?.[0] ? `http://localhost:3000/uploads/${printer.images[0]}` : '/placeholder-printer.jpg'} 
                    alt={printer.name}
                    className="product-thumbnail"
                  />
                </td>
                <td>
                  <div className="product-name">{printer.name}</div>
                  <div className="product-model">{printer.description}</div>
                </td>
                <td>{printer.brand?.name || 'N/A'}</td>
                <td className="price">{formatPrice(printer.price)}</td>
                <td>{printer.printType || 'N/A'}</td>
                <td>{getStatusBadge(printer.status || 'active')}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit('printer', printer)}
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete('printer', printer._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ServicesList = () => (
    <div className="products-list">
      <div className="products-header">
        <h3>🔧 Danh sách Dịch vụ ({products.services.length})</h3>
        <button className="btn-primary" onClick={() => handleAdd('service')}>
          ➕ Thêm dịch vụ mới
        </button>
      </div>
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.services.map((service) => (
              <tr key={service._id}>
                <td>
                  <div className="product-name">{service.name}</div>
                </td>
                <td className="service-description">{service.description}</td>
                <td>{service.type || 'N/A'}</td>
                <td className="price">
                  {service.priceMin === service.priceMax 
                    ? formatPrice(service.priceMin)
                    : `${formatPrice(service.priceMin)} - ${formatPrice(service.priceMax)}`
                  }
                </td>
                <td>{getStatusBadge(service.isActive ? 'active' : 'inactive')}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit('service', service)}
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete('service', service._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminNavBar />
        <div className="admin-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <AdminNavBar />
      <div className="admin-main-content">
        <div className="admin-page-header">
          <h1 className="admin-page-title">📦 Quản lý sản phẩm</h1>
          <p>Quản lý toàn bộ sản phẩm trong hệ thống</p>
        </div>

        {error && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-success-message">
            {success}
          </div>
        )}

        <div className="tabs-container">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'laptops' ? 'active' : ''}`}
              onClick={() => setActiveTab('laptops')}
            >
              💻 Laptop ({products.laptops.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'printers' ? 'active' : ''}`}
              onClick={() => setActiveTab('printers')}
            >
              🖨️ Printer ({products.printers.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              🔧 Dịch vụ ({products.services.length})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'laptops' && <LaptopsList />}
            {activeTab === 'printers' && <PrintersList />}
            {activeTab === 'services' && <ServicesList />}
          </div>
        </div>

        {/* Product Form Modal */}
        {(showAddModal || showEditModal) && (
          <ProductFormModal
            isOpen={showAddModal || showEditModal}
            onClose={() => {setShowAddModal(false); setShowEditModal(false); setEditingProduct(null);}}
            onSave={handleSaveProduct}
            product={editingProduct}
            productType={editingProduct?.productType || activeTab.slice(0, -1)} // Remove 's' from 'laptops'
          />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
