#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================="
echo -e "   Hệ Thống Máy Tính Trần Anh"
echo -e "   Quick Start Script"
echo -e "===========================================${NC}"
echo

# Check Node.js
check_nodejs() {
    echo -e "${BLUE}🔍 Kiểm tra Node.js...${NC}"
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js không được tìm thấy!${NC}"
        echo "Vui lòng cài đặt Node.js từ: https://nodejs.org"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js đã cài đặt: $(node --version)${NC}"
}

# Check MongoDB
check_mongodb() {
    echo -e "${BLUE}🔍 Kiểm tra MongoDB...${NC}"
    if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
        echo -e "${RED}❌ MongoDB không được tìm thấy!${NC}"
        echo "Vui lòng cài đặt MongoDB từ: https://www.mongodb.com/try/download/community"
        exit 1
    fi
    echo -e "${GREEN}✅ MongoDB đã cài đặt${NC}"
}

# Install dependencies
install_deps() {
    echo
    echo -e "${BLUE}📦 Cài đặt dependencies...${NC}"
    echo

    echo "Cài đặt Backend dependencies..."
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Lỗi khi cài đặt backend dependencies!${NC}"
        exit 1
    fi

    echo
    echo "Cài đặt Frontend dependencies..."
    cd ../frontend/may_tinh_tran_anh
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Lỗi khi cài đặt frontend dependencies!${NC}"
        exit 1
    fi

    cd ../..
    echo -e "${GREEN}✅ Cài đặt dependencies thành công!${NC}"
}

# Setup sample data
setup_data() {
    echo
    echo -e "${BLUE}🔧 Setup dữ liệu mẫu...${NC}"
    cd backend
    node setupComplete.js
    cd ..
    echo
    echo -e "${GREEN}✅ Setup dữ liệu hoàn thành!${NC}"
}

# Health check
health_check() {
    echo
    echo -e "${BLUE}🏥 Kiểm tra hệ thống...${NC}"
    cd backend
    node healthCheck.js
    cd ..
}

# Start system
start_system() {
    echo
    echo -e "${BLUE}🚀 Khởi chạy hệ thống...${NC}"
    echo

    echo "Bước 1: Khởi động Backend Server..."
    cd backend
    gnome-terminal --title="Backend Server" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"' 2>/dev/null || \
    (echo "Khởi động backend trong background..." && npm run dev &)
    
    sleep 3

    echo "Bước 2: Khởi động Frontend App..."
    cd ../frontend/may_tinh_tran_anh
    gnome-terminal --title="Frontend App" -- bash -c "npm start; exec bash" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm start"' 2>/dev/null || \
    (echo "Khởi động frontend trong background..." && npm start &)

    cd ../..
    echo
    echo -e "${GREEN}✅ Hệ thống đang khởi động!${NC}"
    echo
    echo -e "${BLUE}🌐 URLs:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo
    echo -e "${BLUE}🔑 Tài khoản mặc định:${NC}"
    echo "   Admin: admin@maytinhrananh.com / admin123"
    echo "   Staff: staff1@maytinhrananh.com / staff123"
    echo
    
    # Try to open browser
    if command -v xdg-open &> /dev/null; then
        echo "Đang mở trình duyệt..."
        xdg-open http://localhost:3000
    elif command -v open &> /dev/null; then
        echo "Đang mở trình duyệt..."
        open http://localhost:3000
    else
        echo "Vui lòng mở trình duyệt và truy cập: http://localhost:3000"
    fi
}

# Cleanup files
cleanup_files() {
    echo
    echo -e "${BLUE}🧹 Dọn dẹp file test và báo cáo...${NC}"
    if [ -f "cleanup.sh" ]; then
        chmod +x cleanup.sh
        ./cleanup.sh
    else
        echo -e "${YELLOW}⚠️  File cleanup.sh không tồn tại${NC}"
    fi
    echo -e "${GREEN}✅ Dọn dẹp hoàn thành!${NC}"
}

# Show menu
show_menu() {
    echo
    echo "Chọn hành động:"
    echo "1. Cài đặt dependencies (lần đầu)"
    echo "2. Setup dữ liệu mẫu"
    echo "3. Kiểm tra hệ thống"
    echo "4. Khởi chạy Backend + Frontend"
    echo "5. Dọn dẹp file test"
    echo "0. Thoát"
    echo
    read -p "Nhập lựa chọn (0-5): " choice
}

# Main function
main() {
    check_nodejs
    check_mongodb

    while true; do
        show_menu
        case $choice in
            1)
                install_deps
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            2)
                setup_data
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            3)
                health_check
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            4)
                start_system
                break
                ;;
            5)
                cleanup_files
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            0)
                echo
                echo -e "${GREEN}👋 Cảm ơn bạn đã sử dụng hệ thống!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Lựa chọn không hợp lệ!${NC}"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
        esac
        clear
    done
}

# Run main function
main
