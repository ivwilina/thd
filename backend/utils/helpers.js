const generateId = (prefix = '') => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const calculateDiscount = (originalPrice, discountPercent) => {
  return originalPrice - (originalPrice * discountPercent / 100);
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phoneNumber.replace(/\s/g, ''));
};

module.exports = {
  generateId,
  formatPrice,
  calculateDiscount,
  validateEmail,
  validatePhoneNumber
};
