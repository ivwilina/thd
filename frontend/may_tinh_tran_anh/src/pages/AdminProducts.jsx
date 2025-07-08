import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrashAlt,
  faPlus,
  faSearch,
  faFilter,
  faLaptop,
  faPrint,
  faToolbox,
  faSync,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faStar,
  faInfoCircle,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import AdminNavBar from '../components/AdminNavBar';
import ProductFormModal from '../components/ProductFormModal';
import apiService from '../services/apiService';
import useAdminProductsStyles from '../hooks/useAdminProductsStyles'; // Import custom hook
import '../assets/unifiedAdminStaff.css';
import '../assets/adminProductsHighPriority.css'; // Import CSS với độ ưu tiên cao để tránh bị ghi đè

const AdminProducts = () => {
  // Sử dụng custom hook để đảm bảo CSS isolation
  useAdminProductsStyles();
  
  const [products, setProducts] = useState({ laptops: [], printers: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('laptops');
  const [showAddModal, setShowAddModal] = useState(false); // Ensure this is false on initial render
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    brand: '',
    condition: '',
    priceRange: '',
    status: '',
    featured: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [laptopsRes, printersRes, servicesRes] = await Promise.all([
        apiService.getLaptops(),
        apiService.getPrinters(),
        apiService.getServices().catch(() => [])
      ]);

      setProducts({
        laptops: Array.isArray(laptopsRes) ? laptopsRes : (laptopsRes?.laptops || []),
        printers: Array.isArray(printersRes) ? printersRes : (printersRes?.printers || []),
        services: Array.isArray(servicesRes) ? servicesRes : (servicesRes?.services || [])
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (product, productType) => {
    setProductToDelete({ product, productType });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    const { product, productType } = productToDelete;
    
    try {
      switch (productType) {
        case 'laptops':
          await apiService.deleteLaptop(product._id);
          break;
        case 'printers':
          await apiService.deletePrinter(product._id);
          break;
        case 'services':
          await apiService.deleteService(product._id);
          break;
        default:
          throw new Error('Unknown product type');
      }
      
      setSuccess('Xóa sản phẩm thành công!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh the product list
      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Không thể xóa sản phẩm. ' + err.message);
    }
  };

  const handleAddProduct = (productType) => {
    setEditingProduct(null);
    setActiveTab(productType);
    setShowAddModal(true);
  };

  const handleEditProduct = (product, productType) => {
    setEditingProduct(product);
    setActiveTab(productType);
    setShowEditModal(true);
  };

  const handleSaveProduct = async (productData, productType) => {
    try {
      const isEditing = !!editingProduct;
      let response;

      switch (productType) {
        case 'laptops':
          if (isEditing) {
            response = await apiService.updateLaptop(editingProduct._id, productData);
          } else {
            response = await apiService.createLaptop(productData);
          }
          break;
        case 'printers':
          if (isEditing) {
            response = await apiService.updatePrinter(editingProduct._id, productData);
          } else {
            response = await apiService.createPrinter(productData);
          }
          break;
        case 'services':
          if (isEditing) {
            response = await apiService.updateService(editingProduct._id, productData);
          } else {
            response = await apiService.createService(productData);
          }
          break;
        default:
          throw new Error('Unknown product type');
      }

      setSuccess(isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
      setTimeout(() => setSuccess(null), 3000);
      
      setShowAddModal(false);
      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Không thể lưu sản phẩm. ' + err.message);
    }
  };

  // Filter products based on search term and filters
  const getFilteredProducts = () => {
    let filteredProducts = products[activeTab] || [];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => {
        const nameMatch = (product.displayName || product.name || product.description || '').toLowerCase().includes(searchLower);
        const modelMatch = (product.model || '').toLowerCase().includes(searchLower);
        const brandMatch = (typeof product.brand === 'string' ? product.brand : (product.brand?.name || '')).toLowerCase().includes(searchLower);
        const idMatch = product._id?.toLowerCase().includes(searchLower);
        
        return nameMatch || modelMatch || brandMatch || idMatch;
      });
    }
    
    // Apply other filters
    if (filterOptions.brand) {
      filteredProducts = filteredProducts.filter(product => {
        const productBrand = typeof product.brand === 'string' ? product.brand : (product.brand?.name || '');
        return productBrand.toLowerCase() === filterOptions.brand.toLowerCase();
      });
    }
    
    if (filterOptions.condition && activeTab !== 'services') {
      filteredProducts = filteredProducts.filter(product => 
        product.condition === filterOptions.condition
      );
    }
    
    if (filterOptions.priceRange) {
      const [min, max] = filterOptions.priceRange.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product => 
        product.price >= min && product.price <= max
      );
    }

    if (filterOptions.status && activeTab !== 'services') {
      filteredProducts = filteredProducts.filter(product => 
        product.availability === filterOptions.status
      );
    }

    if (filterOptions.featured) {
      if (filterOptions.featured === 'featured') {
        filteredProducts = filteredProducts.filter(product => product.isFeatured);
      } else if (filterOptions.featured === 'not-featured') {
        filteredProducts = filteredProducts.filter(product => !product.isFeatured);
      }
    }
    
    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();

  const getBrands = () => {
    const brandSet = new Set();
    const currentProducts = products[activeTab] || [];
    
    currentProducts.forEach(product => {
      const brand = typeof product.brand === 'string' ? product.brand : (product.brand?.name || '');
      if (brand) brandSet.add(brand);
    });
    
    return Array.from(brandSet);
  };

  const renderLaptopTable = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th style={{ width: '5%' }}>#</th>
          <th style={{ width: '10%' }}>Mã</th>
          <th style={{ width: '20%' }}>Tên sản phẩm</th>
          <th style={{ width: '10%' }}>Thương hiệu</th>
          <th style={{ width: '10%' }}>CPU</th>
          <th style={{ width: '10%' }}>Giá (VND)</th>
          <th style={{ width: '10%' }}>Trạng thái</th>
          <th style={{ width: '10%' }}>Đặc biệt</th>
          <th style={{ width: '15%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((laptop, index) => (
          <tr key={laptop._id || index}>
            <td>{index + 1}</td>
            <td>{laptop._id?.substring(0, 8) || 'N/A'}</td>
            <td className="product-name">
              <div className="product-info">
                {laptop.images && laptop.images.length > 0 ? (
                  <img 
                    src={`http://localhost:3000/uploads/${laptop.images[0]}`} 
                    alt={laptop.displayName} 
                    className="product-thumbnail" 
                    onError={(e) => { e.target.src = '/placeholder-laptop.jpg'; }}
                  />
                ) : (
                  <div className="placeholder-thumbnail">
                    <FontAwesomeIcon icon={faLaptop} />
                  </div>
                )}
                <div>
                  <div className="product-title">{laptop.displayName || 'Không có tên'}</div>
                  <div className="product-subtitle">{laptop.model || ''}</div>
                </div>
              </div>
            </td>
            <td>{typeof laptop.brand === 'string' ? laptop.brand : (laptop.brand?.name || 'N/A')}</td>
            <td>{laptop.cpu || 'N/A'}</td>
            <td>{laptop.price ? laptop.price.toLocaleString('vi-VN') : 'N/A'}</td>
            <td>
              <span className={`status-badge ${laptop.availability === 'in-stock' ? 'in-stock' : 
                               laptop.availability === 'out-of-stock' ? 'out-of-stock' : 'normal'}`}>
                {laptop.availability === 'in-stock' ? 'Còn hàng' : 
                 laptop.availability === 'out-of-stock' ? 'Hết hàng' : 
                 laptop.availability === 'pre-order' ? 'Đặt trước' : 'N/A'}
              </span>
            </td>
            <td>
              {laptop.isFeatured ? (
                <span className="featured-badge">
                  <FontAwesomeIcon icon={faStar} /> Nổi bật
                </span>
              ) : laptop.isNewProduct ? (
                <span className="new-badge">
                  <FontAwesomeIcon icon={faCheckCircle} /> Mới
                </span>
              ) : null}
            </td>
            <td>
              <div className="action-buttons">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditProduct(laptop, 'laptops')}
                  title="Sửa"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="view-btn" 
                  onClick={() => window.open(`/products/${laptop._id}`, '_blank')}
                  title="Xem"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => confirmDelete(laptop, 'laptops')}
                  title="Xóa"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPrinterTable = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th style={{ width: '5%' }}>#</th>
          <th style={{ width: '10%' }}>Mã</th>
          <th style={{ width: '25%' }}>Tên sản phẩm</th>
          <th style={{ width: '10%' }}>Thương hiệu</th>
          <th style={{ width: '15%' }}>Loại in</th>
          <th style={{ width: '10%' }}>Giá (VND)</th>
          <th style={{ width: '10%' }}>Trạng thái</th>
          <th style={{ width: '15%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((printer, index) => (
          <tr key={printer._id || index}>
            <td>{index + 1}</td>
            <td>{printer._id?.substring(0, 8) || 'N/A'}</td>
            <td className="product-name">
              <div className="product-info">
                {printer.images && printer.images.length > 0 ? (
                  <img 
                    src={`http://localhost:3000/uploads/${printer.images[0]}`} 
                    alt={printer.description} 
                    className="product-thumbnail" 
                    onError={(e) => { e.target.src = '/placeholder-printer.jpg'; }}
                  />
                ) : (
                  <div className="placeholder-thumbnail">
                    <FontAwesomeIcon icon={faPrint} />
                  </div>
                )}
                <div>
                  <div className="product-title">{printer.description || 'Không có tên'}</div>
                  <div className="product-subtitle">{printer.type || ''}</div>
                </div>
              </div>
            </td>
            <td>{typeof printer.brand === 'string' ? printer.brand : (printer.brand?.name || 'N/A')}</td>
            <td>{printer.printType || 'N/A'}</td>
            <td>{printer.price ? printer.price.toLocaleString('vi-VN') : 'N/A'}</td>
            <td>
              <span className={`status-badge ${printer.availability === 'in-stock' ? 'in-stock' : 
                               printer.availability === 'out-of-stock' ? 'out-of-stock' : 'normal'}`}>
                {printer.availability === 'in-stock' ? 'Còn hàng' : 
                 printer.availability === 'out-of-stock' ? 'Hết hàng' : 
                 printer.availability === 'pre-order' ? 'Đặt trước' : 'N/A'}
              </span>
            </td>
            <td>
              <div className="action-buttons">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditProduct(printer, 'printers')}
                  title="Sửa"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="view-btn" 
                  onClick={() => window.open(`/products/${printer._id}`, '_blank')}
                  title="Xem"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => confirmDelete(printer, 'printers')}
                  title="Xóa"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderServiceTable = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th style={{ width: '5%' }}>#</th>
          <th style={{ width: '10%' }}>Mã</th>
          <th style={{ width: '30%' }}>Tên dịch vụ</th>
          <th style={{ width: '20%' }}>Loại dịch vụ</th>
          <th style={{ width: '15%' }}>Giá (VND)</th>
          <th style={{ width: '5%' }}>Trạng thái</th>
          <th style={{ width: '15%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((service, index) => (
          <tr key={service._id || index}>
            <td>{index + 1}</td>
            <td>{service._id?.substring(0, 8) || 'N/A'}</td>
            <td>
              <div className="service-name">
                <strong>{service.name || 'Không có tên'}</strong>
                {service.description && (
                  <div className="service-description">{service.description}</div>
                )}
              </div>
            </td>
            <td>{service.type || 'N/A'}</td>
            <td>
              {service.priceMin === service.priceMax ?
                `${service.priceMin?.toLocaleString('vi-VN') || 0}` :
                `${service.priceMin?.toLocaleString('vi-VN') || 0} - ${service.priceMax?.toLocaleString('vi-VN') || 0}`
              }
            </td>
            <td>
              <span className={`status-badge ${service.isActive ? 'in-stock' : 'out-of-stock'}`}>
                {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </td>
            <td>
              <div className="action-buttons">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditProduct(service, 'services')}
                  title="Sửa"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => confirmDelete(service, 'services')}
                  title="Xóa"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderAddEditModal = () => {
    // Don't render anything if neither modal is active
    if (!showAddModal && !showEditModal) {
      return null;
    }
    
    // State cho form
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    
    const isEditing = !!editingProduct;
    const modalTitle = isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới';
    
    // Reset form khi mở modal
    useEffect(() => {
      if (showAddModal || showEditModal) {
        if (isEditing && editingProduct) {
          // Pre-fill form with editing product data
          setFormData({
            ...editingProduct,
            productType: activeTab.slice(0, -1) // remove 's' from the end
          });
          
          // Pre-fill images if any
          if (editingProduct.images && editingProduct.images.length > 0) {
            setImagePreview(
              editingProduct.images.map(img => ({
                name: img,
                url: `http://localhost:3000/uploads/${img}`
              }))
            );
          }
        } else {
          // Set default values for new product
          const defaultData = {
            productType: activeTab.slice(0, -1)
          };
          
          // Default values based on product type
          if (activeTab === 'laptops') {
            setFormData({
              ...defaultData,
              displayName: '',
              model: '',
              brand: '',
              price: '',
              cpu: '',
              ram: '',
              storage: '',
              screen: '',
              vga: '',
              os: 'Windows 10',
              warranty: 12,
              status: 'in-stock',
              discount: 0,
              isFeatured: false,
              isNewProduct: true
            });
          } else if (activeTab === 'printers') {
            setFormData({
              ...defaultData,
              name: '',
              brand: '',
              printType: 'laser',
              price: '',
              description: '',
              warranty: 12,
              status: 'in-stock',
              discount: 0,
              isFeatured: false,
              isNewProduct: true
            });
          } else if (activeTab === 'services') {
            setFormData({
              ...defaultData,
              name: '',
              description: '',
              priceMin: '',
              priceMax: '',
              estimatedTime: '',
              status: 'active',
              category: 'repair',
              isFeatured: false
            });
          }
          
          // Reset image preview
          setImagePreview([]);
          setImageFiles([]);
        }
        
        // Reset errors
        setFormErrors({});
        setIsSaving(false);
      }
    }, [showAddModal, showEditModal, isEditing, editingProduct, activeTab]);
    
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      // Clear error for this field if exists
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    };
    
    // Handle image upload
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      
      if (files.length > 0) {
        // Store files for upload
        setImageFiles(prev => [...prev, ...files]);
        
        // Generate preview URLs
        const newPreviews = files.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file)
        }));
        
        setImagePreview(prev => [...prev, ...newPreviews]);
      }
    };
    
    // Remove image from preview
    const removeImage = (index) => {
      setImagePreview(prev => prev.filter((_, i) => i !== index));
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    };
    
    // Validate form based on product type
    const validateForm = () => {
      const errors = {};
      
      // Common validations
      if (activeTab === 'laptops') {
        if (!formData.displayName?.trim()) {
          errors.displayName = 'Tên laptop không được để trống';
        }
        
        if (!formData.brand?.trim()) {
          errors.brand = 'Thương hiệu không được để trống';
        }
        
        if (!formData.model?.trim()) {
          errors.model = 'Model không được để trống';
        }
        
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
          errors.price = 'Giá phải là số dương';
        }
        
        if (!formData.cpu?.trim()) {
          errors.cpu = 'Thông tin CPU không được để trống';
        }
        
        if (!formData.ram?.trim()) {
          errors.ram = 'Thông tin RAM không được để trống';
        }
        
        if (!formData.storage?.trim()) {
          errors.storage = 'Thông tin lưu trữ không được để trống';
        }
      } else if (activeTab === 'printers') {
        if (!formData.name?.trim()) {
          errors.name = 'Tên máy in không được để trống';
        }
        
        if (!formData.brand?.trim()) {
          errors.brand = 'Thương hiệu không được để trống';
        }
        
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
          errors.price = 'Giá phải là số dương';
        }
        
        if (!formData.printType?.trim()) {
          errors.printType = 'Loại máy in không được để trống';
        }
      } else if (activeTab === 'services') {
        if (!formData.name?.trim()) {
          errors.name = 'Tên dịch vụ không được để trống';
        }
        
        if (!formData.description?.trim()) {
          errors.description = 'Mô tả không được để trống';
        }
        
        if (!formData.priceMin || isNaN(formData.priceMin) || Number(formData.priceMin) < 0) {
          errors.priceMin = 'Giá tối thiểu phải là số không âm';
        }
        
        if (!formData.priceMax || isNaN(formData.priceMax) || Number(formData.priceMax) <= 0) {
          errors.priceMax = 'Giá tối đa phải là số dương';
        }
        
        if (Number(formData.priceMin) > Number(formData.priceMax)) {
          errors.priceMax = 'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu';
        }
      }
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
    
    // Submit form
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSaving(true);
      
      try {
        const formDataToSend = { ...formData };
        
        // Handle image upload if there are new images
        if (imageFiles.length > 0) {
          const imageData = new FormData();
          imageFiles.forEach(file => {
            imageData.append('images', file);
          });
          
          const uploadResponse = await apiService.uploadProductImages(imageData);
          
          if (uploadResponse && uploadResponse.imageUrls) {
            // Combine existing and new images
            formDataToSend.images = [
              ...(editingProduct?.images || []),
              ...uploadResponse.imageUrls
            ];
          }
        }
        
        // Format numeric values
        if (formDataToSend.price) {
          formDataToSend.price = Number(formDataToSend.price);
        }
        
        if (formDataToSend.discount) {
          formDataToSend.discount = Number(formDataToSend.discount);
        }
        
        if (formDataToSend.warranty) {
          formDataToSend.warranty = Number(formDataToSend.warranty);
        }
        
        if (formDataToSend.priceMin) {
          formDataToSend.priceMin = Number(formDataToSend.priceMin);
        }
        
        if (formDataToSend.priceMax) {
          formDataToSend.priceMax = Number(formDataToSend.priceMax);
        }
        
        // Save the product data
        if (isEditing) {
          await handleSaveProduct(formDataToSend, activeTab);
        } else {
          await handleSaveProduct(formDataToSend, activeTab);
        }
        
        // Close the modal and show success message
        setShowAddModal(false);
        setShowEditModal(false);
        setSuccess(isEditing ? 'Đã cập nhật sản phẩm thành công!' : 'Đã thêm sản phẩm mới thành công!');
        setTimeout(() => setSuccess(null), 3000);
        
        // Refresh the products list
        fetchProducts();
      } catch (error) {
        console.error('Error saving product:', error);
        setFormErrors(prev => ({
          ...prev,
          submit: `Lỗi: ${error.message || 'Không thể lưu sản phẩm'}`
        }));
      } finally {
        setIsSaving(false);
      }
    };
    
    return (
      <div className="modal-overlay active">
        <div className="modal-container">
          <div className="modal-header">
            <h2>{modalTitle} ({activeTab === 'laptops' ? 'Laptop' : activeTab === 'printers' ? 'Máy in' : 'Dịch vụ'})</h2>
            <button 
              className="close-button"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {formErrors.submit && (
                <div className="error-message" style={{marginBottom: '15px', color: 'var(--product-danger)', padding: '10px', backgroundColor: 'rgba(220, 53, 69, 0.1)', borderRadius: '4px'}}>
                  {formErrors.submit}
                </div>
              )}
              
              {/* Different form fields based on product type */}
              {activeTab === 'laptops' && (
                <>
                  <div className="form-section-title">Thông tin cơ bản</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="displayName">Tên sản phẩm *</label>
                      <input 
                        type="text" 
                        id="displayName" 
                        name="displayName" 
                        value={formData.displayName || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: Laptop Dell XPS 13"
                      />
                      {formErrors.displayName && <div className="error">{formErrors.displayName}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="model">Model *</label>
                      <input 
                        type="text" 
                        id="model" 
                        name="model" 
                        value={formData.model || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: XPS 13-9310"
                      />
                      {formErrors.model && <div className="error">{formErrors.model}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="brand">Thương hiệu *</label>
                      <input 
                        type="text" 
                        id="brand" 
                        name="brand" 
                        value={formData.brand || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: Dell, HP, Asus"
                      />
                      {formErrors.brand && <div className="error">{formErrors.brand}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Giá bán (VND) *</label>
                      <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        min="0"
                        value={formData.price || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 25000000"
                      />
                      {formErrors.price && <div className="error">{formErrors.price}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="discount">Giảm giá (%)</label>
                      <input 
                        type="number" 
                        id="discount" 
                        name="discount" 
                        min="0"
                        max="100"
                        value={formData.discount || '0'} 
                        onChange={handleInputChange}
                        placeholder="VD: 10"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="warranty">Bảo hành (tháng)</label>
                      <input 
                        type="number" 
                        id="warranty" 
                        name="warranty" 
                        min="0"
                        value={formData.warranty || '12'} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-section-title">Thông số kỹ thuật</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="cpu">CPU *</label>
                      <input 
                        type="text" 
                        id="cpu" 
                        name="cpu" 
                        value={formData.cpu || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: Intel Core i7-1165G7"
                      />
                      {formErrors.cpu && <div className="error">{formErrors.cpu}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="ram">RAM *</label>
                      <input 
                        type="text" 
                        id="ram" 
                        name="ram" 
                        value={formData.ram || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 16GB DDR4 3200MHz"
                      />
                      {formErrors.ram && <div className="error">{formErrors.ram}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="storage">Lưu trữ *</label>
                      <input 
                        type="text" 
                        id="storage" 
                        name="storage" 
                        value={formData.storage || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 512GB SSD NVMe"
                      />
                      {formErrors.storage && <div className="error">{formErrors.storage}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="vga">Card đồ họa</label>
                      <input 
                        type="text" 
                        id="vga" 
                        name="vga" 
                        value={formData.vga || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: Intel Iris Xe Graphics"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="screen">Màn hình</label>
                      <input 
                        type="text" 
                        id="screen" 
                        name="screen" 
                        value={formData.screen || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 13.4 inch FHD+ (1920 x 1200)"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="os">Hệ điều hành</label>
                      <input 
                        type="text" 
                        id="os" 
                        name="os" 
                        value={formData.os || 'Windows 10'} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-section-title">Trạng thái & Hình ảnh</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="status">Trạng thái</label>
                      <select 
                        id="status" 
                        name="status" 
                        value={formData.status || 'in-stock'} 
                        onChange={handleInputChange}
                      >
                        <option value="in-stock">Còn hàng</option>
                        <option value="out-of-stock">Hết hàng</option>
                        <option value="pre-order">Đặt trước</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="stock">Số lượng tồn kho</label>
                      <input 
                        type="number" 
                        id="stock" 
                        name="stock" 
                        min="0"
                        value={formData.stock || '0'} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group checkbox-group" style={{gridColumn: '1 / -1'}}>
                      <input 
                        type="checkbox" 
                        id="isFeatured" 
                        name="isFeatured" 
                        checked={formData.isFeatured || false} 
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isFeatured">Sản phẩm nổi bật</label>
                    </div>
                    
                    <div className="form-group checkbox-group" style={{gridColumn: '1 / -1'}}>
                      <input 
                        type="checkbox" 
                        id="isNewProduct" 
                        name="isNewProduct" 
                        checked={formData.isNewProduct || false} 
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isNewProduct">Sản phẩm mới</label>
                    </div>
                  </div>
                  
                  <div className="form-section-title">Hình ảnh sản phẩm</div>
                  <div className="form-group form-image-upload">
                    <input 
                      type="file" 
                      id="images" 
                      name="images" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload}
                    />
                    <p style={{fontSize: '0.85rem', color: '#6c757d', marginTop: '5px'}}>
                      Có thể chọn nhiều hình. Định dạng: JPG, PNG. Tối đa 5MB mỗi ảnh.
                    </p>
                    
                    {imagePreview.length > 0 && (
                      <div className="image-preview-container">
                        {imagePreview.map((img, index) => (
                          <div key={index} className="image-preview">
                            <img src={img.url} alt={`Preview ${index + 1}`} />
                            <button 
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-section-title">Mô tả chi tiết</div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label htmlFor="description">Mô tả</label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description || ''} 
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      rows={5}
                    />
                  </div>
                </>
              )}
              
              {activeTab === 'printers' && (
                <>
                  <div className="form-section-title">Thông tin cơ bản</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Tên máy in *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: Máy in HP LaserJet Pro MFP"
                      />
                      {formErrors.name && <div className="error">{formErrors.name}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="brand">Thương hiệu *</label>
                      <input 
                        type="text" 
                        id="brand" 
                        name="brand" 
                        value={formData.brand || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: HP, Canon, Epson"
                      />
                      {formErrors.brand && <div className="error">{formErrors.brand}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="printType">Loại máy in *</label>
                      <select 
                        id="printType" 
                        name="printType" 
                        value={formData.printType || 'laser'} 
                        onChange={handleInputChange}
                      >
                        <option value="laser">Laser</option>
                        <option value="inkjet">Phun mực</option>
                        <option value="thermal">Nhiệt</option>
                        <option value="dot-matrix">Kim</option>
                        <option value="all-in-one">Đa năng</option>
                      </select>
                      {formErrors.printType && <div className="error">{formErrors.printType}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Giá bán (VND) *</label>
                      <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        min="0"
                        value={formData.price || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 3500000"
                      />
                      {formErrors.price && <div className="error">{formErrors.price}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="discount">Giảm giá (%)</label>
                      <input 
                        type="number" 
                        id="discount" 
                        name="discount" 
                        min="0"
                        max="100"
                        value={formData.discount || '0'} 
                        onChange={handleInputChange}
                        placeholder="VD: 10"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="warranty">Bảo hành (tháng)</label>
                      <input 
                        type="number" 
                        id="warranty" 
                        name="warranty" 
                        min="0"
                        value={formData.warranty || '12'} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-section-title">Thông số kỹ thuật</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="printSpeed">Tốc độ in (trang/phút)</label>
                      <input 
                        type="text" 
                        id="printSpeed" 
                        name="printSpeed" 
                        value={formData.printSpeed || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 22 ppm"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="resolution">Độ phân giải</label>
                      <input 
                        type="text" 
                        id="resolution" 
                        name="resolution" 
                        value={formData.resolution || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 1200 x 1200 dpi"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="paperSize">Khổ giấy tối đa</label>
                      <input 
                        type="text" 
                        id="paperSize" 
                        name="paperSize" 
                        value={formData.paperSize || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: A4"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="connectivity">Kết nối</label>
                      <input 
                        type="text" 
                        id="connectivity" 
                        name="connectivity" 
                        value={formData.connectivity || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: USB, Ethernet, WiFi"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section-title">Trạng thái & Hình ảnh</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="status">Trạng thái</label>
                      <select 
                        id="status" 
                        name="status" 
                        value={formData.status || 'in-stock'} 
                        onChange={handleInputChange}
                      >
                        <option value="in-stock">Còn hàng</option>
                        <option value="out-of-stock">Hết hàng</option>
                        <option value="pre-order">Đặt trước</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="stock">Số lượng tồn kho</label>
                      <input 
                        type="number" 
                        id="stock" 
                        name="stock" 
                        min="0"
                        value={formData.stock || '0'} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group checkbox-group" style={{gridColumn: '1 / -1'}}>
                      <input 
                        type="checkbox" 
                        id="isFeatured" 
                        name="isFeatured" 
                        checked={formData.isFeatured || false} 
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isFeatured">Sản phẩm nổi bật</label>
                    </div>
                    
                    <div className="form-group checkbox-group" style={{gridColumn: '1 / -1'}}>
                      <input 
                        type="checkbox" 
                        id="isNewProduct" 
                        name="isNewProduct" 
                        checked={formData.isNewProduct || false} 
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isNewProduct">Sản phẩm mới</label>
                    </div>
                  </div>
                  
                  <div className="form-section-title">Hình ảnh sản phẩm</div>
                  <div className="form-group form-image-upload">
                    <input 
                      type="file" 
                      id="images" 
                      name="images" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload}
                    />
                    <p style={{fontSize: '0.85rem', color: '#6c757d', marginTop: '5px'}}>
                      Có thể chọn nhiều hình. Định dạng: JPG, PNG. Tối đa 5MB mỗi ảnh.
                    </p>
                    
                    {imagePreview.length > 0 && (
                      <div className="image-preview-container">
                        {imagePreview.map((img, index) => (
                          <div key={index} className="image-preview">
                            <img src={img.url} alt={`Preview ${index + 1}`} />
                            <button 
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-section-title">Mô tả chi tiết</div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label htmlFor="description">Mô tả *</label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description || ''} 
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về máy in..."
                      rows={5}
                    />
                    {formErrors.description && <div className="error">{formErrors.description}</div>}
                  </div>
                </>
              )}
              
              {activeTab === 'services' && (
                <>
                  <div className="form-section-title">Thông tin dịch vụ</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Tên dịch vụ *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: Bảo trì máy tính định kỳ"
                      />
                      {formErrors.name && <div className="error">{formErrors.name}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="category">Loại dịch vụ</label>
                      <select 
                        id="category" 
                        name="category" 
                        value={formData.category || 'repair'} 
                        onChange={handleInputChange}
                      >
                        <option value="repair">Sửa chữa</option>
                        <option value="maintenance">Bảo trì</option>
                        <option value="installation">Cài đặt</option>
                        <option value="consultation">Tư vấn</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="priceMin">Giá tối thiểu (VND) *</label>
                      <input 
                        type="number" 
                        id="priceMin" 
                        name="priceMin" 
                        min="0"
                        value={formData.priceMin || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 150000"
                      />
                      {formErrors.priceMin && <div className="error">{formErrors.priceMin}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="priceMax">Giá tối đa (VND) *</label>
                      <input 
                        type="number" 
                        id="priceMax" 
                        name="priceMax" 
                        min="0"
                        value={formData.priceMax || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 500000"
                      />
                      {formErrors.priceMax && <div className="error">{formErrors.priceMax}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="estimatedTime">Thời gian dự kiến</label>
                      <input 
                        type="text" 
                        id="estimatedTime" 
                        name="estimatedTime" 
                        value={formData.estimatedTime || ''} 
                        onChange={handleInputChange}
                        placeholder="VD: 30-60 phút"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="status">Trạng thái</label>
                      <select 
                        id="status" 
                        name="status" 
                        value={formData.status || 'active'} 
                        onChange={handleInputChange}
                      >
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm ngưng</option>
                        <option value="coming-soon">Sắp ra mắt</option>
                      </select>
                    </div>
                    
                    <div className="form-group checkbox-group" style={{gridColumn: '1 / -1'}}>
                      <input 
                        type="checkbox" 
                        id="isFeatured" 
                        name="isFeatured" 
                        checked={formData.isFeatured || false} 
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isFeatured">Dịch vụ nổi bật</label>
                    </div>
                  </div>
                  
                  <div className="form-section-title">Mô tả chi tiết</div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label htmlFor="description">Mô tả *</label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description || ''} 
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về dịch vụ..."
                      rows={5}
                    />
                    {formErrors.description && <div className="error">{formErrors.description}</div>}
                  </div>
                  
                  <div className="form-group" style={{gridColumn: '1 / -1'}}>
                    <label htmlFor="serviceDetails">Chi tiết dịch vụ</label>
                    <textarea 
                      id="serviceDetails" 
                      name="serviceDetails" 
                      value={formData.serviceDetails || ''} 
                      onChange={handleInputChange}
                      placeholder="Các bước thực hiện, quy trình, chính sách..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="save-button"
                disabled={isSaving}
              >
                {isSaving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    if (!productToDelete) return null;
    
    const { product, productType } = productToDelete;
    const productName = productType === 'services' ? 
      (product.name || 'dịch vụ này') : 
      (product.displayName || product.description || 'sản phẩm này');
    
    return (
      <div className={`modal-overlay ${showDeleteModal ? 'active' : ''}`}>
        <div className="modal-container delete-modal">
          <div className="modal-header">
            <h2>Xác nhận xóa</h2>
            <button 
              className="close-button"
              onClick={() => {
                setShowDeleteModal(false);
                setProductToDelete(null);
              }}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="delete-warning">
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
              <p>Bạn có chắc chắn muốn xóa <strong>{productName}</strong>?</p>
              <p className="warning-text">Hành động này không thể hoàn tác.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="cancel-button"
              onClick={() => {
                setShowDeleteModal(false);
                setProductToDelete(null);
              }}
            >
              Hủy
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page admin-products-page" data-page="admin-products">
      <AdminNavBar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Quản lý sản phẩm</h1
          >
          
          {success && (
            <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} /> {success}
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <FontAwesomeIcon icon={faTimesCircle} /> {error}
            </div>
          )}
        </div>
        
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'laptops' ? 'active' : ''}`}
            onClick={() => setActiveTab('laptops')}
          >
            <FontAwesomeIcon icon={faLaptop} /> Laptop ({products.laptops.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'printers' ? 'active' : ''}`}
            onClick={() => setActiveTab('printers')}
          >
            <FontAwesomeIcon icon={faPrint} /> Máy in ({products.printers.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <FontAwesomeIcon icon={faToolbox} /> Dịch vụ ({products.services.length})
          </button>
        </div>
        
        <div className="admin-controls">
          <div className="search-filter-row">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label><FontAwesomeIcon icon={faFilter} /> Thương hiệu:</label>
                <select
                  value={filterOptions.brand}
                  onChange={(e) => setFilterOptions({...filterOptions, brand: e.target.value})}
                >
                  <option value="">Tất cả</option>
                  {getBrands().map((brand, idx) => (
                    <option key={idx} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              {activeTab !== 'services' && (
                <div className="filter-group">
                  <label>Trạng thái:</label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                  >
                    <option value="">Tất cả</option>
                    <option value="in-stock">Còn hàng</option>
                    <option value="out-of-stock">Hết hàng</option>
                    <option value="pre-order">Đặt trước</option>
                  </select>
                </div>
              )}
              
              <div className="filter-group">
                <label>Đặc biệt:</label>
                <select
                  value={filterOptions.featured}
                  onChange={(e) => setFilterOptions({...filterOptions, featured: e.target.value})}
                >
                  <option value="">Tất cả</option>
                  <option value="featured">Nổi bật</option>
                  <option value="not-featured">Không nổi bật</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="admin-actions">
            <button 
              className="refresh-button"
              onClick={fetchProducts}
              title="Làm mới danh sách"
            >
              <FontAwesomeIcon icon={faSync} /> Làm mới
            </button>
            <button 
              className="add-button"
              onClick={() => handleAddProduct(activeTab)}
              title="Thêm sản phẩm mới"
            >
              <FontAwesomeIcon icon={faPlus} /> Thêm {activeTab === 'laptops' ? 'Laptop' : activeTab === 'printers' ? 'Máy in' : 'Dịch vụ'}
            </button>
          </div>
        </div>
        
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>Không tìm thấy {activeTab === 'laptops' ? 'laptop' : activeTab === 'printers' ? 'máy in' : 'dịch vụ'} nào {searchTerm ? 'phù hợp với tìm kiếm' : ''}</p>
            </div>
          ) : (
            <>
              {activeTab === 'laptops' && renderLaptopTable()}
              {activeTab === 'printers' && renderPrinterTable()}
              {activeTab === 'services' && renderServiceTable()}
              
              <div className="table-summary">
                <p>Hiển thị {filteredProducts.length} / {products[activeTab]?.length || 0} {activeTab === 'laptops' ? 'laptop' : activeTab === 'printers' ? 'máy in' : 'dịch vụ'}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Show add/edit modal using component */}
      {showAddModal && (
        <ProductFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={(formData) => handleSaveProduct(formData, activeTab)}
          productType={activeTab.slice(0, -1)} // remove 's' from the end
        />
      )}
      
      {showEditModal && (
        <ProductFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(formData) => handleSaveProduct(formData, activeTab)}
          product={editingProduct}
          productType={activeTab.slice(0, -1)} // remove 's' from the end
        />
      )}
      {renderDeleteModal()}
    </div>
  );
};

export default AdminProducts;
