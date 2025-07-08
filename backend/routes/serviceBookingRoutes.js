const express = require('express');
const router = express.Router();
const ServiceBooking = require('../models/ServiceBooking');
// const Service = require('../models/Service'); // Not needed for now

// GET /api/service-bookings - Get all service bookings
router.get('/', async (req, res) => {
  try {
    const { status, customerEmail, customerPhone, page = 1, limit = 10 } = req.query;
    
    let bookings;
    
    if (status) {
      bookings = await ServiceBooking.getBookingsByStatus(status);
    } else if (customerEmail) {
      bookings = await ServiceBooking.getBookingsByCustomer(customerEmail);
    } else if (customerPhone) {
      // Search by phone number
      bookings = await ServiceBooking.find({ customerPhone: customerPhone });
    } else {
      bookings = await ServiceBooking.getAllBookings();
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBookings = bookings.slice(startIndex, endIndex);
    
    res.json({
      bookings: paginatedBookings,
      total: bookings.length,
      page: parseInt(page),
      totalPages: Math.ceil(bookings.length / limit)
    });
  } catch (error) {
    console.error('Error fetching service bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/service-bookings/:id - Get service booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await ServiceBooking.getBookingById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    
    res.json({
      data: booking,
      success: true
    });
  } catch (error) {
    console.error('Error fetching service booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/service-bookings - Create new service booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body); // Debug log
    
    const {
      serviceId,
      serviceName,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      preferredDate,
      preferredTime,
      notes,
      description // Handle both notes and description
    } = req.body;
    
    // Basic validation - only check essential fields
    if (!serviceId || !customerName || !customerEmail || !customerPhone || !preferredDate || !preferredTime) {
      const missingFields = [];
      if (!serviceId) missingFields.push('serviceId');
      if (!customerName) missingFields.push('customerName');
      if (!customerEmail) missingFields.push('customerEmail');
      if (!customerPhone) missingFields.push('customerPhone');
      if (!preferredDate) missingFields.push('preferredDate');
      if (!preferredTime) missingFields.push('preferredTime');
      
      console.log('Missing fields:', missingFields); // Debug log
      
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }
    
    const bookingData = {
      serviceId,
      serviceName: serviceName || `Service ${serviceId}`, // Default serviceName if not provided
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      preferredDate: new Date(preferredDate),
      preferredTime,
      notes: notes || description || '', // Handle both field names
      status: 'pending'
    };
    
    console.log('Creating booking with data:', bookingData); // Debug log
    
    const booking = await ServiceBooking.createBooking(bookingData);
    
    res.status(201).json({
      data: booking,
      message: 'Đặt lịch dịch vụ thành công',
      success: true
    });
  } catch (error) {
    console.error('Error creating service booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/service-bookings/:id - Update service booking
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const booking = await ServiceBooking.findByIdAndUpdate(id, updates, { new: true });
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    
    res.json({
      data: booking,
      message: 'Cập nhật đơn đặt dịch vụ thành công',
      success: true
    });
  } catch (error) {
    console.error('Error updating service booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/service-bookings/:id/status - Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staffNotes, finalPrice, assignedStaff } = req.body;
    
    const updates = {};
    if (staffNotes) updates.staffNotes = staffNotes;
    if (finalPrice) updates.finalPrice = finalPrice;
    if (assignedStaff) updates.assignedStaff = assignedStaff;
    
    const booking = await ServiceBooking.updateBookingStatus(id, status, updates);
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    
    res.json({
      data: booking,
      message: `Cập nhật trạng thái thành '${booking.statusDisplay}' thành công`,
      success: true
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/service-bookings/:id - Delete service booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await ServiceBooking.deleteBooking(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    
    res.json({
      message: 'Xóa đơn đặt dịch vụ thành công',
      success: true
    });
  } catch (error) {
    console.error('Error deleting service booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/service-bookings/stats/summary - Get booking statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const allBookings = await ServiceBooking.getAllBookings();
    
    const stats = {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === 'pending').length,
      confirmed: allBookings.filter(b => b.status === 'confirmed').length,
      inProgress: allBookings.filter(b => b.status === 'in-progress').length,
      completed: allBookings.filter(b => b.status === 'completed').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length
    };
    
    res.json({
      data: stats,
      success: true
    });
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
