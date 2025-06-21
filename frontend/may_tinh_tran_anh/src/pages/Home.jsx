import React from "react";
import { Link } from "react-router-dom";
import "../assets/home.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  // Sample products data based on the image
  const featuredProducts = [
    {
      id: 1,
      name: "MÁY IN CANON 2900 - CŨ",
      price: "2,000,000 đ",
      image: "/product1.jpg",
    },
    {
      id: 2,
      name: "Màn hình LCD SAMSUNG LS19A330NHEXXV (1366 x 768/TN/60Hz/5 ms)",
      price: "2,700,000 đ",
      image: "/product2.jpg",
    },
    {
      id: 3,
      name: 'Màn hình LCD Dell E1916H-18.5"',
      price: "2,750,000 đ",
      image: "/product3.jpg",
    },
    {
      id: 4,
      name: "Màn hình LCD Samsung LF24T350FHEXXV (23.8 inch/IPS)",
      price: "3,450,000 đ",
      image: "/product4.jpg",
    },
    {
      id: 5,
      name: "MÁY IN CANON 2900",
      price: "3,490,000 đ",
      image: "/product5.jpg",
    },
  ];

  return (
    <div className="home-container">
      <NavBar />

      <main className="main-content">
        {/* Hero Banner Section */}{" "}
        <section className="hero-section">
          <div className="container">
            <div className="hero-wrapper">
              {" "}
              {/* <div className="category-sidebar">
                <ul className="category-list">
                  <li>
                    <Link to="/laptop-chinh-hang">Laptop Chính Hãng</Link>
                  </li>
                  <li>
                    <Link to="/cay-may-tinh-moi">Cây Máy Tính Mới</Link>
                  </li>
                  <li>
                    <Link to="/bo-cay-may-tinh-moi">BỘ CÂY MÁY TÍNH MỚI</Link>
                  </li>
                  <li>
                    <Link to="/cay-dong-bo-moi">CÂY ĐỒNG BỘ MỚI</Link>
                  </li>
                  <li>
                    <Link to="/man-hinh-may-tinh">MÀN HÌNH MÁY TÍNH</Link>
                  </li>
                  <li>
                    <Link to="/bo-cay-may-tinh-cu-gia-re">
                      BỘ CÂY MÁY TÍNH CŨ GIÁ RẺ
                    </Link>
                  </li>
                  <li>
                    <Link to="/may-in-chinh-hang">MÁY IN CHÍNH HÃNG</Link>
                  </li>
                  <li>
                    <Link to="/cay-may-tinh-cu">CÂY MÁY TÍNH CŨ</Link>
                  </li>
                  <li>
                    <Link to="/hop-muc-may-in">HỘP MỰC MÁY IN</Link>
                  </li>
                  <li>
                    <Link to="/linh-kien-laptop">LINH KIỆN LAPTOP</Link>
                  </li>
                  <li>
                    <Link to="/laptop-cu-gia-re">LAPTOP CŨ GIÁ RẺ</Link>
                  </li>
                  <li>
                    <Link to="/may-tinh-de-ban-gia-re">
                      MÁY TÍNH ĐỂ BÀN GIÁ RẺ
                    </Link>
                  </li>
                  <li>
                    <Link to="/bo-cay-may-tinh-cu">BỘ CÂY MÁY TÍNH CŨ</Link>
                  </li>
                  <li>
                    <Link to="/may-in-cu">MÁY IN CŨ</Link>
                  </li>
                </ul>
              </div> */}
              <div className="hero-banner">
                <div className="banner-image">
                  <img
                    src="/banner.jpg"
                    alt="Máy Tính Trần Anh - Nhà phân phối chính Dell"
                    className="banner-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Products Section */}
        <section className="featured-products">
          <div className="container">            <div className="section-header">
              <h2 className="section-title">SẢN PHẨM ĐANG BÁN CHẠY</h2>
              <Link to="/products" className="view-all">
                Xem tất cả
              </Link>
            </div>

            <div className="product-grid">              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="product-price">
                      <span className="price-label">Giá KM: </span>
                      <span className="price-value">{product.price}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="btn-details">
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>{" "}
        {/* Chat Support Section */}
        <div className="chat-support">
          <div className="chat-button">
            <FontAwesomeIcon icon={faComments} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
