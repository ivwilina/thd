// Cart Service - Quản lý giỏ hàng với localStorage
class CartService {
  constructor() {
    this.storageKey = 'tran_anh_cart';
    this.listeners = [];
  }

  // Lấy giỏ hàng từ localStorage
  getCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  }

  // Lưu giỏ hàng vào localStorage
  saveCart(cart) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Nếu sản phẩm đã có trong giỏ, tăng số lượng
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới vào giỏ
      cart.push({
        id: product.id,
        name: product.name,
        image: product.images ? product.images[0] : product.image,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discount: product.discount,
        brand: product.brand,
        quantity: quantity,
        stock: product.stock,
        category: product.category
      });
    }

    this.saveCart(cart);
    return cart;
  }

  // Cập nhật số lượng sản phẩm trong giỏ
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.saveCart(cart);
    }

    return cart;
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId) {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    this.saveCart(filteredCart);
    return filteredCart;
  }

  // Xóa toàn bộ giỏ hàng
  clearCart() {
    localStorage.removeItem(this.storageKey);
    this.notifyListeners();
    return [];
  }

  // Lấy tổng số lượng sản phẩm trong giỏ
  getCartItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Lấy tổng giá trị giỏ hàng
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.discountPrice.replace(/[^\d]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  // Định dạng giá tiền
  formatPrice(price) {
    return `${price.toLocaleString('vi-VN')}đ`;
  }

  // Đăng ký listener để theo dõi thay đổi giỏ hàng
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Hủy đăng ký listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Thông báo cho tất cả listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getCart()));
  }

  // Kiểm tra sản phẩm có trong giỏ hàng không
  isInCart(productId) {
    const cart = this.getCart();
    return cart.some(item => item.id === productId);
  }

  // Lấy thông tin sản phẩm trong giỏ hàng
  getCartItem(productId) {
    const cart = this.getCart();
    return cart.find(item => item.id === productId);
  }
}

// Export singleton instance
const cartService = new CartService();
export default cartService;
