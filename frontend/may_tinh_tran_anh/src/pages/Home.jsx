import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/home.css";
import NavBar from "../components/NavBar";
import ImageWithFallback from "../components/ImageWithFallback";
import apiService from "../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured laptops and printers
        const [featuredLaptops, featuredPrinters] = await Promise.all([
          apiService.getFeaturedLaptops(),
          apiService.getFeaturedPrinters()
        ]);
        
        // Combine and format products
        const allFeatured = [
          ...(featuredLaptops.data || []),
          ...(featuredPrinters.data || [])
        ];
        
        const formattedProducts = allFeatured
          .slice(0, 8) // Limit to 8 featured products
          .map(product => apiService.formatProductForDisplay(product));
        
        setFeaturedProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Keep default empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-container home">
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
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">SẢN PHẨM ĐANG BÁN CHẠY</h2>
              <Link to="/services" className="view-all">
                Xem dịch vụ
              </Link>
            </div>

            {loading ? (
              <div className="loading-products">Đang tải sản phẩm...</div>
            ) : (
              <div className="product-grid">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      {product.discount && (
                        <div className="discount-badge">Giảm {product.discount}</div>
                      )}
                      <div className="product-image">
                        <Link to={`/product/${product.id}`}>
                          <ImageWithFallback
                            src={product.image}
                            fallbackSrc={product.category === 'laptop' ? 
                              'http://localhost:3000/uploads/placeholder-laptop.jpg' : 
                              'http://localhost:3000/uploads/placeholder-printer.jpg'
                            }
                            alt={product.name}
                          />
                        </Link>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <div className="product-specs">{product.specs}</div>
                        <div className="product-price">
                          <span className="price-label">Giá KM: </span>
                          <span className="price-value">{product.discountPrice}</span>
                          {product.originalPrice !== product.discountPrice && (
                            <span className="original-price">{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="product-brand">Thương hiệu: {product.brand}</div>
                        <Link to={`/product/${product.id}`} className="btn-details">
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-products">Không có sản phẩm nổi bật</div>
                )}
              </div>
            )}
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
