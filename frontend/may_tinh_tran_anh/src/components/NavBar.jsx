import React from "react";
import { Link } from "react-router-dom";
import "../assets/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faComments,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
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
            <input type="text" placeholder="Nhập từ khóa tìm kiếm" />{" "}
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="contact-info">
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
            {" "}            <li className="menu-category">
              <FontAwesomeIcon icon={faBars} />
              <span>DANH MỤC SẢN PHẨM</span>
              <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
              <div className="dropdown-menu">
                <ul className="category-dropdown-list">
                  <li><Link to="/laptop-chinh-hang">Laptop Chính Hãng</Link></li>
                  <li><Link to="/may-in-chinh-hang">MÁY IN CHÍNH HÃNG</Link></li>
                  <li><Link to="/hop-muc-may-in">HỘP MỰC MÁY IN</Link></li>
                  <li><Link to="/laptop-cu-gia-re">LAPTOP CŨ GIÁ RẺ</Link></li>
                  <li><Link to="/may-in-cu">MÁY IN CŨ</Link></li>
                </ul>
              </div>
            </li>
            <li>
              <Link to="/sua-laptop">SỬA LAPTOP TẠI NHÀ</Link>
            </li>
            <li>
              <Link to="/cho-thue-laptop">CHO THUÊ LAPTOP PC, MÁY IN</Link>
            </li>
            <li>
              <Link to="/do-muc-may-in">ĐỔ MỰC MÁY IN</Link>
            </li>
            <li>
              <Link to="/sua-may-tinh">SỬA MÁY TÍNH, MÁY IN</Link>
            </li>
            <li>
              <Link to="/mua-may-tinh-cu">MUA MÁY TÍNH, MÁY IN CŨ</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
