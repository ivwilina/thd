import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/navbar.css";
import cartService from "../services/cartService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faComments,
  faCaretDown,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy số lượng sản phẩm trong giỏ hàng khi component mount
    const updateCartCount = () => {
      const count = cartService.getCartItemCount();
      setCartItemCount(count);
    };

    updateCartCount();

    // Lắng nghe thay đổi giỏ hàng
    cartService.addListener(updateCartCount);

    return () => {
      cartService.removeListener(updateCartCount);
    };
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Điều hướng đến trang tất cả sản phẩm với query tìm kiếm
      navigate(`/all-products?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Xử lý tìm kiếm khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="navbar-container">
      {/* Top Navigation */}
      {/* <div className="top-nav">
        <div className="container top-nav-container">
          <div className="top-nav-links">
            <Link to="/" className="nav-link">
              Trang chủ
            </Link>
            <Link to="/so-do-chi-duong" className="nav-link">
              Sơ đồ chỉ đường
            </Link>
            <Link to="/gioi-thieu" className="nav-link">
              Giới thiệu
            </Link>
            <Link to="/dich-vu" className="nav-link">
              Dịch vụ
            </Link>
            <Link to="/tin-tuc" className="nav-link">
              Tin tức - Sự kiện
            </Link>
            <Link to="/sua-may-in" className="nav-link">
              Sửa Máy In Tại Nhà Hà Nội
            </Link>
          </div>
          <div className="hotline">
            Hotline: <a href="tel:0819329999">081.932.9999</a> -{" "}
            <a href="tel:0911618193">0911.61.81.93</a>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="main-header">
        <div className="container main-header-container">
          {" "}
          <div className="logo">
            <Link to="/">
              <img
                src="/logo.svg"
                alt="Máy Tính Trần Anh"
                className="logo-img"
              />
            </Link>
          </div>
          <div className="search-box">
            <form
              onSubmit={handleSearch}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm laptop, máy in, thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{ flex: 1 }}
              />
              <button className="search-button" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
          <div className="contact-info">
            <div className="cart-icon">
              <Link to="/cart" className="cart-link">
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </div>
            <div className="hotline-box">
              <span className="hotline-label">HOTLINE</span>
              <div className="phone-numbers">
                <a href="tel:0963872333">09XX XXX XXX</a> -{" "}
                <a href="tel:0245328933">02XX XXX XXX</a> -{" "}
                <a href="tel:0246654333">02XX XXX XXX</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="container main-nav-container">
          <ul className="main-menu">
            {" "}
            <li className="menu-category">
              <div className="menu-category-content">
                <FontAwesomeIcon icon={faBars} />
                <span>DANH MỤC SẢN PHẨM</span>
              </div>
              <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
              <div className="dropdown-menu">
                <ul className="category-dropdown-list">
                  <li>
                    <Link to="/all-products">TẤT CẢ SẢN PHẨM</Link>
                  </li>
                  <li>
                    <Link to="/laptop-chinh-hang">Laptop Chính Hãng</Link>
                  </li>
                  <li>
                    <Link to="/may-in-chinh-hang">MÁY IN CHÍNH HÃNG</Link>
                  </li>
                  <li>
                    <Link to="/laptop-cu-gia-re">LAPTOP CŨ GIÁ RẺ</Link>
                  </li>
                  <li>
                    <Link to="/may-in-cu">MÁY IN CŨ</Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <Link to="/services">DỊCH VỤ</Link>
            </li>
            <li>
              <Link to="/services">SỬA LAPTOP TẠI NHÀ</Link>
            </li>
            <li>
              <Link to="/services">SỬA MÁY TÍNH, MÁY IN</Link>
            </li>
            <li>
              <Link to="/all-products?condition=Cũ">MUA MÁY TÍNH, MÁY IN CŨ</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
