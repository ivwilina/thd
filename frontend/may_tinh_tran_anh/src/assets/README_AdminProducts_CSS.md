# Admin Products CSS Scoping

## Tổng quan
File CSS này được thiết kế để tránh xung đột với các trang khác trong ứng dụng. Sử dụng nhiều kỹ thuật để đảm bảo CSS isolation.

## Các file liên quan
- `adminProductsHighPriority.css` - CSS chính với độ ưu tiên cao
- `AdminProducts.module.css` - CSS Modules (backup option)
- `useAdminProductsStyles.js` - Custom hook để quản lý CSS scoping
- `AdminProductsWrapper.jsx` - Wrapper component (nếu cần)

## Cách thức hoạt động

### 1. CSS Selectors với độ ưu tiên cao
```css
/* Sử dụng multiple selectors để tăng specificity */
.admin-page.admin-products-page[data-page="admin-products"] {
  /* styles */
}

body.admin-products-active .admin-page.admin-products-page {
  /* styles */
}

html[data-admin-page="products"] .admin-page.admin-products-page {
  /* styles */
}
```

### 2. CSS Variables (Custom Properties)
```css
.admin-page.admin-products-page {
  --ap-primary: #e63312;
  --ap-secondary: #2c3e50;
  /* ... */
}
```

### 3. !important declarations
Tất cả styles đều sử dụng `!important` để đảm bảo không bị ghi đè.

### 4. Custom Hook
```javascript
import useAdminProductsStyles from '../hooks/useAdminProductsStyles';

const AdminProducts = () => {
  useAdminProductsStyles(); // Thêm body classes và data attributes
  // ...
};
```

## Sử dụng

### Trong Component
```jsx
import useAdminProductsStyles from '../hooks/useAdminProductsStyles';
import '../assets/adminProductsHighPriority.css';

const AdminProducts = () => {
  useAdminProductsStyles();
  
  return (
    <div className="admin-page admin-products-page" data-page="admin-products">
      {/* content */}
    </div>
  );
};
```

### CSS Classes có sẵn
- `.admin-page.admin-products-page` - Container chính
- `.admin-tabs` - Navigation tabs
- `.admin-actions` - Action bar
- `.admin-table` - Bảng dữ liệu
- `.modal-overlay` - Modal backdrop
- `.status-badge` - Status badges
- `.action-buttons` - Button groups

## Troubleshooting

### Nếu CSS vẫn bị ghi đè:
1. Kiểm tra thứ tự import CSS files
2. Đảm bảo custom hook được gọi trong component
3. Kiểm tra data attributes có được thêm vào DOM
4. Xem developer tools để debug CSS specificity

### Kiểm tra CSS đang hoạt động:
```javascript
// Trong console của browser
console.log(document.documentElement.getAttribute('data-admin-page')); // Should be "products"
console.log(document.body.classList.contains('admin-products-active')); // Should be true
```

## Best Practices

1. **Luôn sử dụng custom hook** trong AdminProducts component
2. **Không modify** các CSS variables trong runtime
3. **Test** trên nhiều browsers khác nhau
4. **Kiểm tra** responsive design trên mobile
5. **Backup** CSS với CSS Modules nếu cần

## CSS Variables Reference

| Variable | Value | Usage |
|----------|-------|-------|
| `--ap-primary` | #e63312 | Primary brand color |
| `--ap-secondary` | #2c3e50 | Secondary color |
| `--ap-success` | #28a745 | Success states |
| `--ap-warning` | #ffc107 | Warning states |
| `--ap-danger` | #dc3545 | Error states |
| `--ap-info` | #17a2b8 | Info states |
| `--ap-light` | #f8f9fa | Light backgrounds |
| `--ap-dark` | #343a40 | Dark text |
| `--ap-border` | #e9ecef | Border colors |
| `--ap-shadow` | 0 2px 10px rgba(0,0,0,0.1) | Box shadows |

## Responsive Breakpoints

- Mobile: `@media (max-width: 480px)`
- Tablet: `@media (max-width: 768px)`
- Desktop: `@media (min-width: 769px)`

## Notes

- CSS file có kích thước ~25KB (minified ~18KB)
- Tương thích với IE11+, Chrome, Firefox, Safari
- Hỗ trợ dark mode thông qua CSS variables
- Print styles included cho in ấn
