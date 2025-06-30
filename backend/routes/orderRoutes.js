const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Log = require('../models/Log');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateOrder = [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerPhoneNumber').notEmpty().withMessage('Phone number is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerAddress').notEmpty().withMessage('Address is required'),
  body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('billingMethod').isIn(['bank-transfer', 'cash-on-delivery', 'cash']).withMessage('Invalid billing method')
];

// GET /api/orders - Get all orders with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, date, customer, type, page = 1, limit = 10 } = req.query;
    
    let orders;
    
    if (status) {
      orders = await Order.getOrdersByStatus(status);
    } else if (date) {
      orders = await Order.getOrdersByDate(new Date(date));
    } else if (customer) {
      orders = await Order.getOrdersByCustomer(customer);
    } else if (type) {
      orders = await Order.getOrdersByType(type);
    } else {
      orders = await Order.getAllOrders();
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    res.json({
      orders: paginatedOrders,
      total: orders.length,
      page: parseInt(page),
      totalPages: Math.ceil(orders.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/status/:status - Get orders by status
router.get('/status/:status', async (req, res) => {
  try {
    const orders = await Order.getOrdersByStatus(req.params.status);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/date/:date - Get orders by date
router.get('/date/:date', async (req, res) => {
  try {
    const orders = await Order.getOrdersByDate(new Date(req.params.date));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/customer/:customer - Get orders by customer info
router.get('/customer/:customer', async (req, res) => {
  try {
    const orders = await Order.getOrdersByCustomer(req.params.customer);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/type/:type - Get orders by type
router.get('/type/:type', async (req, res) => {
  try {
    const orders = await Order.getOrdersByType(req.params.type);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders - Create new order
router.post('/', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate unique order ID
    const orderId = 'ORD' + Date.now();
    const orderData = {
      ...req.body,
      _id: orderId
    };

    const order = await Order.createOrder(orderData);
    res.status(201).json({ 
      success: true,
      message: 'Đặt hàng thành công!',
      order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message 
    });
  }
});

// PUT /api/orders/:id - Update order
router.put('/:id', async (req, res) => {
  try {
    const success = await Order.updateOrder(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/confirm - Confirm order
router.put('/:id/confirm', async (req, res) => {
  try {
    const order = await Order.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be confirmed in current status' });
    }

    const employeeId = req.user?.id || 'system';
    const success = await order.confirmOrder(employeeId);
    
    if (!success) {
      return res.status(400).json({ message: 'Failed to confirm order' });
    }

    // Ghi log
    await Log.create({
      _id: `${order._id}_confirm_${Date.now()}`,
      employeeId: employeeId,
      action: `Xác nhận đơn hàng ${order._id}`,
      timestamp: new Date()
    });

    res.json({ 
      success: true,
      message: 'Order confirmed successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled in current status' });
    }

    const employeeId = req.user?.id || 'system';
    const success = await order.cancelOrder(employeeId, reason);
    
    if (!success) {
      return res.status(400).json({ message: 'Failed to cancel order' });
    }

    // Ghi log
    await Log.create({
      _id: `${order._id}_cancel_${Date.now()}`,
      employeeId: employeeId,
      action: `Hủy đơn hàng ${order._id}${reason ? ` - Lý do: ${reason}` : ''}`,
      timestamp: new Date()
    });

    res.json({ 
      success: true,
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const employeeId = req.user?.id || 'system';
    const success = await order.updateOrderStatus(status, employeeId);
    if (!success) {
      return res.status(400).json({ message: 'Failed to update order status' });
    }
    
    // Ghi log
    await Log.create({
      _id: `${order._id}_status_${Date.now()}`,
      employeeId: employeeId,
      action: `Cập nhật trạng thái đơn hàng ${order._id} thành ${status}`,
      timestamp: new Date()
    });
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/complete - Complete order
router.put('/:id/complete', async (req, res) => {
  try {
    const order = await Order.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot complete cancelled order' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Order is already completed' });
    }

    const employeeId = req.user?.id || 'system';

    // Nếu là đơn sản phẩm thì trừ tồn kho
    if (order.type === 'product' || order.type === 'mixed') {
      for (const item of order.orderItems) {
        if (item.itemType !== 'service') {
          // Tìm inventory theo productId và productType
          const inventory = await Inventory.findOne({ 
            productId: item.itemId, 
            productType: item.itemType 
          });
          
          if (!inventory) {
            return res.status(400).json({ 
              message: `Inventory not found for product ${item.itemName}` 
            });
          }
          
          if (inventory.availableStock < item.quantity) {
            return res.status(400).json({ 
              message: `Not enough stock for product ${item.itemName}. Available: ${inventory.availableStock}, Required: ${item.quantity}` 
            });
          }
          
          // Trừ tồn kho
          inventory.currentStock -= item.quantity;
          inventory.availableStock = Math.max(0, inventory.currentStock - inventory.reservedStock);
          inventory.lastSold = new Date();
          
          // Ghi nhận xuất kho
          inventory.stockMovements.push({
            type: 'OUT',
            quantity: item.quantity,
            reason: 'Order completed',
            reference: order._id,
            employeeId: employeeId,
            date: new Date(),
            notes: `Hoàn thành đơn hàng cho khách: ${order.customerName}`
          });
          
          await inventory.save();
        }
      }
    }

    // Cập nhật trạng thái đơn hàng
    const success = await order.completeOrder(employeeId);
    if (!success) {
      return res.status(400).json({ message: 'Failed to complete order' });
    }

    // Ghi log thao tác
    await Log.create({
      _id: `${order._id}_complete_${Date.now()}`,
      employeeId: employeeId,
      action: `Hoàn thành đơn hàng ${order._id}`,
      timestamp: new Date()
    });

    res.json({ 
      success: true,
      message: 'Order completed successfully' 
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    const success = await Order.deleteOrder(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
