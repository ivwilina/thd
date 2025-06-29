import StaffRoute from './components/StaffRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import ServiceListing from './pages/ServiceListing'
import Cart from './pages/Cart'
import AllProducts from './pages/AllProducts'
import StaffOrders from './pages/StaffOrders'
import Login from './pages/Login'
import './assets/login.css'
import StaffDashboard from './pages/StaffDashboard'
import StaffInventory from './pages/StaffInventory'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServiceListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/search" element={<AllProducts />} />
        <Route path="/:category" element={<ProductListing />} />
        <Route path="/staff/orders" element={<StaffRoute><StaffOrders /></StaffRoute>} />
        <Route path="/staff" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
        <Route path="/staff/inventory" element={<StaffRoute><StaffInventory /></StaffRoute>} />
      </Routes>
    </Router>
  )
}

export default App
