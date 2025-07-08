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
    // Handle both array response and object response with laptops property
    return Array.isArray(res) ? res : (res.laptops || res.data || []);
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
    // Handle both array response and object response with printers property
    return Array.isArray(res) ? res : (res.printers || res.data || []);
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

  // ========== ORDER ENDPOINTS ==========
  
  // Get all orders
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  // Get order by ID
  async getOrderById(id) {
    return this.get(`/orders/${id}`);
  }

  // Create new order
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  // Confirm order
  async confirmOrder(orderId, employeeId) {
    return this.put(`/orders/${orderId}/confirm`, { employeeId });
  }

  // Cancel order
  async cancelOrder(orderId, reason, employeeId) {
    return this.put(`/orders/${orderId}/cancel`, { reason, employeeId });
  }

  // Complete order
  async completeOrder(orderId, employeeId) {
    return this.put(`/orders/${orderId}/complete`, { employeeId });
  }

  // Update order status
  async updateOrderStatus(orderId, status, employeeId) {
    return this.put(`/orders/${orderId}/status`, { status, employeeId });
  }

  // Get orders by status
  async getOrdersByStatus(status) {
    return this.get(`/orders?status=${status}`);
  }

  // Inventory Statistics API methods
  async getInventoryOverview() {
    return this.get('/inventory/stats/overview');
  }

  async getInventoryMovements(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/inventory/stats/movements${queryString ? `?${queryString}` : ''}`);
  }

  async getLowStockProducts() {
    return this.get('/inventory/stats/low-stock');
  }

  async getTurnoverStats(period = '30') {
    return this.get(`/inventory/stats/turnover?period=${period}`);
  }

  async getValueAnalysis() {
    return this.get('/inventory/stats/value-analysis');
  }

  async getInventoryList(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/inventory${queryString ? `?${queryString}` : ''}`);
  }

  // Staff Inventory - Get products with stock info
  async getStaffInventoryProducts() {
    return this.get('/inventory/staff/products');
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
  
  // Helper function to format CPU name
  formatCPUName(cpu) {
    if (!cpu) return '';
    
    const cpuMappings = {
      'INTEL_I3_1115G4': 'Intel Core i3-1115G4',
      'INTEL_I5_1135G7': 'Intel Core i5-1135G7',
      'INTEL_I7_1165G7': 'Intel Core i7-1165G7',
      'INTEL_I5_10500H': 'Intel Core i5-10500H',
      'INTEL_I7_1185G7': 'Intel Core i7-1185G7',
      'AMD_RYZEN5_5500U': 'AMD Ryzen 5 5500U',
      'APPLE_M1': 'Apple M1',
    };
    
    return cpuMappings[cpu] || cpu.replace(/_/g, ' ');
  }

  // Helper function to format brand name
  formatBrandName(brand) {
    if (!brand) return 'Unknown';
    
    const brandMappings = {
      'DELL': 'Dell',
      'HP': 'HP',
      'ASUS': 'Asus',
      'LENOVO': 'Lenovo',
      'APPLE': 'Apple',
      'MSI': 'MSI',
      'CANON': 'Canon',
      'EPSON': 'Epson',
      'BROTHER': 'Brother'
    };
    
    return brandMappings[brand] || brand;
  }

  // Format product data for frontend display
  formatProductForDisplay(product) {
    if (!product) {
      console.warn('⚠️ Product is null/undefined');
      return null;
    }
    
    const isLaptop = product.cpu; // Laptops have CPU field
    
    if (isLaptop) {
      return {
        id: product._id,
        name: product.displayName,
        specs: `${this.formatCPUName(product.cpu)} ${product.ramDetails} ${product.storageDetails} ${product.screenDetails}`,
        originalPrice: `${product.price.toLocaleString('vi-VN')}đ`,
        discountPrice: product.discount ? 
          `${Math.round(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ` : 
          `${product.price.toLocaleString('vi-VN')}đ`,
        savingAmount: product.discount ? 
          `${Math.round(product.price * product.discount / 100).toLocaleString('vi-VN')}đ` : '0đ',
        image: product.images?.[0] ? `${BACKEND_BASE_URL}/uploads/${product.images[0]}` : '/placeholder-laptop.jpg',
        discount: product.discount ? `${product.discount}%` : null,
        brand: this.formatBrandName(product.brand),
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
        brand: this.formatBrandName(product.brand),
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

  // ========== LAPTOP CRUD OPERATIONS ==========
  
  // Create laptop
  async createLaptop(laptopData) {
    return this.post('/laptops', laptopData);
  }

  // Update laptop
  async updateLaptop(id, laptopData) {
    return this.put(`/laptops/${id}`, laptopData);
  }

  // Delete laptop
  async deleteLaptop(id) {
    return this.delete(`/laptops/${id}`);
  }

  // ========== PRINTER CRUD OPERATIONS ==========
  
  // Create printer
  async createPrinter(printerData) {
    return this.post('/printers', printerData);
  }

  // Update printer
  async updatePrinter(id, printerData) {
    return this.put(`/printers/${id}`, printerData);
  }

  // Delete printer
  async deletePrinter(id) {
    return this.delete(`/printers/${id}`);
  }

  // ========== EMPLOYEE/ACCOUNT CRUD OPERATIONS ==========
  
  // Create employee
  async createEmployee(employeeData) {
    return this.post('/employees', employeeData);
  }

  // Update employee
  async updateEmployee(id, employeeData) {
    return this.put(`/employees/${id}`, employeeData);
  }

  // Delete employee
  async deleteEmployee(id) {
    return this.delete(`/employees/${id}`);
  }

  // Get all employees
  async getEmployees(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res = await this.get(`/employees${queryString ? `?${queryString}` : ''}`);
    return Array.isArray(res) ? res : (res.data || []);
  }

  // Get employee by ID
  async getEmployeeById(id) {
    return this.get(`/employees/${id}`);
  }

  // ========== SERVICE CRUD OPERATIONS ==========
  
  // Create service
  async createService(serviceData) {
    return this.post('/services', serviceData);
  }

  // Update service
  async updateService(id, serviceData) {
    return this.put(`/services/${id}`, serviceData);
  }

  // Delete service
  async deleteService(id) {
    return this.delete(`/services/${id}`);
  }

  // ========== ALL PRODUCTS ENDPOINT ==========
  
  // Get all products (laptops + printers)
  async getAllProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res = await this.get(`/all-products${queryString ? `?${queryString}` : ''}`);
    return res.products || [];
  }

  // Search all products
  async searchAllProducts(query, filters = {}) {
    const params = { search: query, ...filters };
    return this.getAllProducts(params);
  }

  // ========== SERVICE BOOKING ENDPOINTS ==========
  
  // Get all service bookings
  async getServiceBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res = await this.get(`/service-bookings${queryString ? `?${queryString}` : ''}`);
    return res.bookings || [];
  }

  // Get service booking by ID
  async getServiceBookingById(id) {
    return this.get(`/service-bookings/${id}`);
  }

  // Create service booking
  async createServiceBooking(bookingData) {
    return this.post('/service-bookings', bookingData);
  }

  // Update service booking
  async updateServiceBooking(id, bookingData) {
    return this.put(`/service-bookings/${id}`, bookingData);
  }

  // Update service booking status
  async updateServiceBookingStatus(id, status, updates = {}) {
    return this.put(`/service-bookings/${id}/status`, { status, ...updates });
  }

  // Delete service booking
  async deleteServiceBooking(id) {
    return this.delete(`/service-bookings/${id}`);
  }

  // Get service booking statistics
  async getServiceBookingStats() {
    return this.get('/service-bookings/stats/summary');
  }

  // ========== PRODUCT MANAGEMENT ==========
}


// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
export { apiService };
