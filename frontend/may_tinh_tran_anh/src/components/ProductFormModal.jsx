import React, { useState, useEffect, useCallback } from 'react';
import '../assets/unifiedAdminStaff.css';

const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null, 
  productType = 'laptop' 
}) => {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const getDefaultFormData = (type) => {
    const common = {
      name: '',
      description: '',
      price: '',
      status: 'active'
    };

    switch (type) {
      case 'laptop':
        return {
          ...common,
          displayName: '',
          model: '',
          brand: '',
          processor: '',
          ram: '',
          storage: '',
          graphics: '',
          screen: '',
          operatingSystem: '',
          discount: '',
          category: 'new',
          warranty: '12',
          stock: '0'
        };
      case 'printer':
        return {
          ...common,
          model: '',
          brand: '',
          printType: 'laser',
          printSpeed: '',
          maxPaperSize: 'A4',
          connectivity: '',
          warranty: '12',
          stock: '0'
        };
      case 'service':
        return {
          ...common,
          type: 'repair',
          priceMin: '',
          priceMax: '',
          duration: '',
          isActive: true
        };
      default:
        return common;
    }
  };

  const initializeFormData = useCallback(() => {
    const defaultData = getDefaultFormData(productType);
    if (product && product._id) {
      setFormData({ ...defaultData, ...product, productType });
    } else {
      setFormData({ ...defaultData, productType });
    }
  }, [product, productType]);

  useEffect(() => {
    if (isOpen) {
      initializeFormData();
      setErrors({});
    }
  }, [isOpen, product, productType, initializeFormData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (productType === 'laptop') {
      if (!formData.displayName?.trim()) {
        newErrors.displayName = 'Tên laptop là bắt buộc';
      }
      if (!formData.brand?.trim()) {
        newErrors.brand = 'Thương hiệu là bắt buộc';
      }
    } else if (productType === 'printer') {
      if (!formData.name?.trim()) {
        newErrors.name = 'Tên printer là bắt buộc';
      }
      if (!formData.brand?.trim()) {
        newErrors.brand = 'Thương hiệu là bắt buộc';
      }
    } else if (productType === 'service') {
      if (!formData.name?.trim()) {
        newErrors.name = 'Tên dịch vụ là bắt buộc';
      }
      if (!formData.priceMin || isNaN(formData.priceMin) || Number(formData.priceMin) <= 0) {
        newErrors.priceMin = 'Giá tối thiểu phải là số dương';
      }
      if (!formData.priceMax || isNaN(formData.priceMax) || Number(formData.priceMax) <= 0) {
        newErrors.priceMax = 'Giá tối đa phải là số dương';
      }
    }

    if (productType !== 'service') {
      if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
        newErrors.price = 'Giá phải là số dương';
      }
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
      const processedData = { ...formData };
      
      // Convert appropriate data types for laptop
      if (productType === 'laptop') {
        // Generate ID if creating new
        if (!processedData._id) {
          processedData._id = 'laptop-' + Date.now();
        }
        
        // Convert simple brand name to brand object if needed
        if (typeof processedData.brand === 'string') {
          processedData.brand = {
            _id: processedData.brand.toLowerCase(),
            name: processedData.brand
          };
        }
        
        // Create basic required objects if they don't exist
        if (!processedData.cpu && processedData.processor) {
          processedData.cpu = {
            _id: 'cpu-' + processedData.processor.toLowerCase().replace(/\s+/g, ''),
            name: processedData.processor
          };
        }
        
        if (!processedData.ramSize && processedData.ram) {
          const ramValue = parseInt(processedData.ram);
          processedData.ramSize = {
            _id: 'ram-' + ramValue,
            size: ramValue
          };
        }
        
        if (!processedData.storageSize && processedData.storage) {
          const storageValue = parseInt(processedData.storage);
          processedData.storageSize = {
            _id: 'storage-' + storageValue,
            size: storageValue
          };
        }
        
        if (!processedData.screenSize && processedData.screen) {
          const screenValue = parseFloat(processedData.screen);
          processedData.screenSize = {
            _id: 'screen-' + screenValue,
            size: screenValue
          };
        }
        
        if (!processedData.vga && processedData.graphics) {
          processedData.vga = {
            _id: 'vga-' + processedData.graphics.toLowerCase().replace(/\s+/g, ''),
            name: processedData.graphics
          };
        }
        
        // Set default model if not provided
        if (!processedData.model) {
          processedData.model = processedData.displayName || 'Standard Model';
        }
        
        // Convert numeric fields
        processedData.price = Number(processedData.price);
        processedData.discount = Number(processedData.discount || 0);
        processedData.stock = Number(processedData.stock || 0);
        processedData.isNewProduct = processedData.category === 'new';
        processedData.isFeatured = false;
        
      } else if (productType === 'printer') {
        if (!processedData._id) {
          processedData._id = 'printer-' + Date.now();
        }
        
        // Convert brand to object if needed
        if (typeof processedData.brand === 'string') {
          processedData.brand = {
            _id: processedData.brand.toLowerCase(),
            name: processedData.brand
          };
        }
        
        processedData.price = Number(processedData.price);
        processedData.stock = Number(processedData.stock || 0);
        
      } else if (productType === 'service') {
        if (!processedData._id) {
          processedData._id = 'service-' + Date.now();
        }
        
        processedData.priceMin = Number(processedData.priceMin);
        processedData.priceMax = Number(processedData.priceMax);
      }

      await onSave(processedData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ general: 'Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const renderLaptopFields = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Tên laptop *</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: Dell Inspiron 15 3000"
            className={errors.displayName ? 'error' : ''}
          />
          {errors.displayName && <span className="error-text">{errors.displayName}</span>}
        </div>
        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 3511-N4020"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Thương hiệu *</label>
          <select
            name="brand"
            value={typeof formData.brand === 'object' ? formData.brand.name : formData.brand || ''}
            onChange={handleInputChange}
            className={errors.brand ? 'error' : ''}
          >
            <option value="">Chọn thương hiệu</option>
            <option value="Dell">Dell</option>
            <option value="HP">HP</option>
            <option value="Lenovo">Lenovo</option>
            <option value="Asus">Asus</option>
            <option value="Acer">Acer</option>
            <option value="MSI">MSI</option>
            <option value="Apple">Apple</option>
          </select>
          {errors.brand && <span className="error-text">{errors.brand}</span>}
        </div>
        <div className="form-group">
          <label>Bộ xử lý</label>
          <input
            type="text"
            name="processor"
            value={formData.processor || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: Intel Core i5-1135G7"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>RAM (GB)</label>
          <input
            type="text"
            name="ram"
            value={formData.ram || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 8"
          />
        </div>
        <div className="form-group">
          <label>Ổ cứng (GB)</label>
          <input
            type="text"
            name="storage"
            value={formData.storage || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 512"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Card đồ họa</label>
          <input
            type="text"
            name="graphics"
            value={formData.graphics || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: Intel Iris Xe Graphics"
          />
        </div>
        <div className="form-group">
          <label>Màn hình (inch)</label>
          <input
            type="text"
            name="screen"
            value={formData.screen || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 15.6"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Giá bán (VND) *</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            placeholder="15000000"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label>Tồn kho</label>
          <input
            type="number"
            name="stock"
            value={formData.stock || ''}
            onChange={handleInputChange}
            placeholder="10"
            min="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Giảm giá (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount || ''}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            max="100"
          />
        </div>
        <div className="form-group">
          <label>Loại</label>
          <select
            name="category"
            value={formData.category || 'new'}
            onChange={handleInputChange}
          >
            <option value="new">Mới</option>
            <option value="used">Đã sử dụng</option>
            <option value="gaming">Gaming</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderPrinterFields = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Tên printer *</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: HP LaserJet Pro M404n"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Thương hiệu *</label>
          <select
            name="brand"
            value={typeof formData.brand === 'object' ? formData.brand.name : formData.brand || ''}
            onChange={handleInputChange}
            className={errors.brand ? 'error' : ''}
          >
            <option value="">Chọn thương hiệu</option>
            <option value="HP">HP</option>
            <option value="Canon">Canon</option>
            <option value="Epson">Epson</option>
            <option value="Brother">Brother</option>
            <option value="Samsung">Samsung</option>
          </select>
          {errors.brand && <span className="error-text">{errors.brand}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Loại in</label>
          <select
            name="printType"
            value={formData.printType || 'laser'}
            onChange={handleInputChange}
          >
            <option value="laser">Laser</option>
            <option value="inkjet">Phun mực</option>
            <option value="thermal">Nhiệt</option>
          </select>
        </div>
        <div className="form-group">
          <label>Giá bán (VND) *</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            placeholder="5000000"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Tồn kho</label>
          <input
            type="number"
            name="stock"
            value={formData.stock || ''}
            onChange={handleInputChange}
            placeholder="5"
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Kết nối</label>
          <input
            type="text"
            name="connectivity"
            value={formData.connectivity || ''}
            onChange={handleInputChange}
            placeholder="USB, Wi-Fi, Ethernet"
          />
        </div>
      </div>
    </>
  );

  const renderServiceFields = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Tên dịch vụ *</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: Sửa chữa laptop"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Loại dịch vụ</label>
          <select
            name="type"
            value={formData.type || 'repair'}
            onChange={handleInputChange}
          >
            <option value="repair">Sửa chữa</option>
            <option value="maintenance">Bảo trì</option>
            <option value="installation">Cài đặt</option>
            <option value="upgrade">Nâng cấp</option>
            <option value="consultation">Tư vấn</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Giá tối thiểu (VND) *</label>
          <input
            type="number"
            name="priceMin"
            value={formData.priceMin || ''}
            onChange={handleInputChange}
            placeholder="100000"
            className={errors.priceMin ? 'error' : ''}
          />
          {errors.priceMin && <span className="error-text">{errors.priceMin}</span>}
        </div>
        <div className="form-group">
          <label>Giá tối đa (VND) *</label>
          <input
            type="number"
            name="priceMax"
            value={formData.priceMax || ''}
            onChange={handleInputChange}
            placeholder="500000"
            className={errors.priceMax ? 'error' : ''}
          />
          {errors.priceMax && <span className="error-text">{errors.priceMax}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Trạng thái</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive || false}
              onChange={handleInputChange}
            />
            Đang hoạt động
          </label>
        </div>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {product?._id ? '✏️ Chỉnh sửa' : '➕ Thêm'} {
              productType === 'laptop' ? 'Laptop' : 
              productType === 'printer' ? 'Printer' : 
              'Dịch vụ'
            }
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

            {productType === 'laptop' && renderLaptopFields()}
            {productType === 'printer' && renderPrinterFields()}
            {productType === 'service' && renderServiceFields()}

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về sản phẩm/dịch vụ..."
                rows="3"
              />
            </div>

            {productType !== 'service' && (
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleInputChange}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            )}
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
              {saving ? 'Đang lưu...' : (product?._id ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
