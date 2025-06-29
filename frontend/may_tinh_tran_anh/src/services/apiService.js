// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';
const BACKEND_BASE_URL = 'http://localhost:3000';

// API Service class for making HTTP requests
class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ========== LAPTOP ENDPOINTS ==========
  
  // Get all laptops
  async getLaptops(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res = await this.get(`/laptops${queryString ? `?${queryString}` : ''}`);
    return Array.isArray(res) ? res : (res.data || []);
  }

  // Get laptop by ID
  async getLaptopById(id) {
    return this.get(`/laptops/${id}`);
  }

  // Search laptops
  async searchLaptops(query, filters = {}) {
    const params = { search: query, ...filters };
    return this.getLaptops(params);
  }

  // Get laptops by brand
  async getLaptopsByBrand(brand) {
    return this.get(`/laptops/brand/${brand}`);
  }

  // Get featured laptops
  async getFeaturedLaptops() {
    return this.get('/laptops/featured');
  }

  // Get new laptops
  async getNewLaptops() {
    return this.get('/laptops/new');
  }

  // Get used laptops
  async getUsedLaptops() {
    return this.get('/laptops/used');
  }

  // ========== PRINTER ENDPOINTS ==========
  
  // Get all printers
  async getPrinters(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res = await this.get(`/printers${queryString ? `?${queryString}` : ''}`);
    return Array.isArray(res) ? res : (res.data || []);
  }

  // Get printer by ID
  async getPrinterById(id) {
    return this.get(`/printers/${id}`);
  }

  // Search printers
  async searchPrinters(query, filters = {}) {
    const params = { search: query, ...filters };
    return this.getPrinters(params);
  }

  // Get printers by brand
  async getPrintersByBrand(brand) {
    return this.get(`/printers/brand/${brand}`);
  }

  // Get featured printers
  async getFeaturedPrinters() {
    return this.get('/printers/featured');
  }

  // Get new printers
  async getNewPrinters() {
    return this.get('/printers/new');
  }

  // Get used printers
  async getUsedPrinters() {
    return this.get('/printers/used');
  }

  // ========== SERVICE ENDPOINTS ==========
  
  // Get all services
  async getServices() {
    return this.get('/services');
  }

  // Get service by ID
  async getServiceById(id) {
    return this.get(`/services/${id}`);
  }

  // Get services by type
  async getServicesByType(type) {
    return this.get(`/services/type/${type}`);
  }

  // Get featured services
  async getFeaturedServices() {
    return this.get('/services/featured');
  }

  // Search services
  async searchServices(query) {
    return this.get(`/services/search/${encodeURIComponent(query)}`);
  }

  // ========== CATEGORY-SPECIFIC METHODS ==========
  
  // Get products by category
  async getProductsByCategory(category) {
    switch (category) {
      case 'laptop-chinh-hang':
        return this.getNewLaptops();
      case 'laptop-cu-gia-re':
        return this.getUsedLaptops();
      case 'may-in-chinh-hang':
        return this.getNewPrinters();
      case 'may-in-cu':
        return this.getUsedPrinters();
      case 'hop-muc-may-in':
        // This would need a separate endpoint for ink cartridges
        return [];
      default: {
        // Trả về tất cả laptop và printer dạng mảng
        const [laptops, printers] = await Promise.all([
          this.getLaptops(),
          this.getPrinters()
        ]);
        return [...laptops, ...printers];
      }
    }
  }

  // ========== HELPER METHODS ==========
  
  // Format product data for frontend display
  formatProductForDisplay(product) {
    const isLaptop = product.cpu; // Laptops have CPU field
    
    if (isLaptop) {
      return {
        id: product._id,
        name: product.displayName,
        specs: `${product.cpu?.name || ''} ${product.ramDetails} ${product.storageDetails} ${product.screenDetails}`,
        originalPrice: `${product.price.toLocaleString('vi-VN')}đ`,
        discountPrice: product.discount ? 
          `${Math.round(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ` : 
          `${product.price.toLocaleString('vi-VN')}đ`,
        savingAmount: product.discount ? 
          `${Math.round(product.price * product.discount / 100).toLocaleString('vi-VN')}đ` : '0đ',
        image: product.images?.[0] ? `${BACKEND_BASE_URL}/uploads/${product.images[0]}` : '/placeholder-laptop.jpg',
        discount: product.discount ? `${product.discount}%` : null,
        brand: product.brand?.name || 'Unknown',
        category: 'laptop',
        isNew: product.isNewProduct,
        isFeatured: product.isFeatured
      };
    } else {
      // Printer
      return {
        id: product._id,
        name: product.description,
        specs: `${product.printType} ${product.printFeatures?.map(f => f.name).join(', ') || ''}`,
        originalPrice: `${product.price.toLocaleString('vi-VN')}đ`,
        discountPrice: product.discount ? 
          `${Math.round(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ` : 
          `${product.price.toLocaleString('vi-VN')}đ`,
        savingAmount: product.discount ? 
          `${Math.round(product.price * product.discount / 100).toLocaleString('vi-VN')}đ` : '0đ',
        image: product.images?.[0] ? `${BACKEND_BASE_URL}/uploads/${product.images[0]}` : '/placeholder-printer.jpg',
        discount: product.discount ? `${product.discount}%` : null,
        brand: product.brand?.name || 'Unknown',
        category: 'printer',
        isNew: product.isNewProduct,
        isFeatured: product.isFeatured
      };
    }
  }

  // Format service data for display
  formatServiceForDisplay(service) {
    const priceText = service.priceMin === 0 && service.priceMax === 0 
      ? 'Miễn phí' 
      : service.priceMin === service.priceMax 
        ? `${service.priceMin.toLocaleString('vi-VN')}đ`
        : `${service.priceMin.toLocaleString('vi-VN')}đ - ${service.priceMax.toLocaleString('vi-VN')}đ`;

    return {
      id: service._id,
      name: service.name,
      description: service.description,
      price: priceText,
      type: service.type,
      isFeatured: service.isFeatured,
      isActive: service.isActive
    };
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
