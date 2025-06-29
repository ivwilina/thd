// Service for inventory management
class InventoryService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/inventory';
  }

  // Lấy thông tin tồn kho của một sản phẩm
  async getProductInventory(productId) {
    try {
      const response = await fetch(`${this.baseURL}/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Nếu không tìm thấy inventory, trả về stock mặc định với cảnh báo
          console.warn(`No inventory found for product ${productId}`);
          return {
            currentStock: 50, // Default stock khi không có data
            availableStock: 50,
            reservedStock: 0,
            stockStatus: 'IN_STOCK',
            needsReorder: false,
            _fallback: true,
            _reason: 'NOT_FOUND'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { ...data, _fallback: false };
    } catch (error) {
      // Check if it's a network error (backend not running)
      if (error.message.includes('fetch') || error.name === 'TypeError') {
        console.warn('Backend inventory service not available, using fallback stock data');
        // Return reasonable default stock when backend is not available
        return {
          currentStock: 25, // Reasonable default stock
          availableStock: 25,
          reservedStock: 0,
          stockStatus: 'IN_STOCK',
          needsReorder: false,
          _fallback: true,
          _reason: 'BACKEND_UNAVAILABLE'
        };
      }
      
      console.error('Error fetching product inventory:', error);
      // Trả về stock mặc định nếu có lỗi khác
      return {
        currentStock: 0,
        availableStock: 0,
        reservedStock: 0,
        stockStatus: 'OUT_OF_STOCK',
        needsReorder: true,
        _fallback: true,
        _reason: 'ERROR'
      };
    }
  }

  // Lấy danh sách tồn kho với filter
  async getInventoryList(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.productType) params.append('productType', filters.productType);
      if (filters.warehouse) params.append('warehouse', filters.warehouse);
      if (filters.status) params.append('status', filters.status);
      if (filters.lowStock) params.append('lowStock', filters.lowStock);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await fetch(`${this.baseURL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory list:', error);
      return {
        inventory: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      };
    }
  }

  // Lấy thống kê tổng quan
  async getOverviewStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats/overview`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      return {
        byProductType: [],
        alerts: { lowStock: 0, outOfStock: 0 }
      };
    }
  }

  // Lấy cảnh báo hàng sắp hết
  async getLowStockAlerts() {
    try {
      const response = await fetch(`${this.baseURL}/alerts/low-stock`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching low stock alerts:', error);
      return [];
    }
  }

  // Cập nhật tồn kho (cho admin)
  async updateStock(productId, quantityChange, reason, reference = '') {
    try {
      const response = await fetch(`${this.baseURL}/${productId}/update-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantityChange,
          reason,
          reference
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Đặt trước hàng
  async reserveStock(productId, quantity, reason, reference = '') {
    try {
      const response = await fetch(`${this.baseURL}/${productId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          reason,
          reference
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error reserving stock:', error);
      throw error;
    }
  }

  // Utility methods
  formatStockStatus(stockStatus) {
    const statusMap = {
      'IN_STOCK': 'Còn hàng',
      'LOW_STOCK': 'Sắp hết hàng',
      'REORDER_NEEDED': 'Cần đặt hàng',
      'OUT_OF_STOCK': 'Hết hàng'
    };
    return statusMap[stockStatus] || 'Không xác định';
  }

  getStockStatusClass(stockStatus) {
    const classMap = {
      'IN_STOCK': 'in-stock',
      'LOW_STOCK': 'low-stock',
      'REORDER_NEEDED': 'reorder-needed',
      'OUT_OF_STOCK': 'out-of-stock'
    };
    return classMap[stockStatus] || 'unknown-stock';
  }

  isStockAvailable(inventory, requestedQuantity = 1) {
    return inventory && inventory.availableStock >= requestedQuantity;
  }

  getMaxOrderQuantity(inventory) {
    return inventory ? inventory.availableStock : 0;
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
