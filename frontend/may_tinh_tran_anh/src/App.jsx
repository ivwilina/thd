import ProtectedRoute from './components/ProtectedRoute'
import RouteMatcher from './components/RouteMatcher'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import ServiceListing from './pages/ServiceListing'
import ServiceBooking from './pages/ServiceBooking'
import MyServiceBookings from './pages/MyServiceBookings'
import Cart from './pages/Cart'
import AllProducts from './pages/AllProducts.simple'
import StaffOrders from './pages/StaffOrders'
import Login from './pages/Login'
import './assets/login.css'
import StaffDashboard from './pages/StaffDashboard'
import StaffInventory from './pages/StaffInventory'
import StaffServiceBookings from './pages/StaffServiceBookings'
import AdminProducts from './pages/AdminProducts'
import AdminInventory from './pages/AdminInventory'
import AdminAccounts from './pages/AdminAccounts'
import AdminReports from './pages/AdminReports'

function App() {
  return (
    <Router>
      <Routes>
        {/* Route mặc định - tự động phân quyền */}
        <Route path="/" element={<RouteMatcher />} />
        
        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />
        
        {/* Trang chủ công khai cho khách hàng */}
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<ServiceListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/search" element={<AllProducts />} />
        <Route path="/my-service-bookings" element={<MyServiceBookings />} />
        <Route path="/:category" element={<ProductListing />} />
        <Route path="/service-booking/:serviceId?" element={<ServiceBooking />} />
        
        {/* Routes cho Staff - yêu cầu role 'staff' */}
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/orders" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/inventory" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffInventory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/service-bookings" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffServiceBookings />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes cho Admin - yêu cầu role 'admin' */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/inventory" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminInventory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/accounts" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAccounts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
