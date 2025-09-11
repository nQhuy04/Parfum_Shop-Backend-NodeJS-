# Parfum Shop - Backend (Node.JS & Express.JS)

Đây là hệ thống backend cho dự án Parfum Shop, được xây dựng bằng Node.js, Express.js và MongoDB. Hệ thống cung cấp một bộ API RESTful hoàn chỉnh để hỗ trợ tất cả các chức năng của một trang web thương mại điện tử.

> Đây là phần Backend của một dự án Full-stack. Vui lòng tham khảo repository của Frontend tại đây: https://github.com/nQhuy04/Parfum_Shop-Frontend-ReactJS-

## ✨ Các Tính Năng & Kiến trúc nổi bật

- **Kiến trúc phân lớp:** Code được tổ chức rõ ràng theo các lớp **Routes**, **Controllers**, và **Services**, giúp dễ dàng bảo trì, mở rộng và tuân thủ nguyên tắc Single Responsibility.
- **API RESTful:** Thiết kế API theo chuẩn REST, cung cấp đầy đủ các endpoint cho các tài nguyên:
  - **Auth:** Đăng ký, Đăng nhập (cho cả User và Admin), cấp JWT Token.
  - **Users (CRUD):** Quản lý thông tin người dùng (Admin).
  - **Products (CRUD):** Quản lý thông tin sản phẩm (Admin).
  - **Cart:** Các chức năng quản lý giỏ hàng cá nhân.
  - **Orders:** Tạo đơn hàng từ giỏ hàng, xem lịch sử đơn hàng cá nhân, và quản lý toàn bộ đơn hàng (Admin).
- **Xác thực & Phân quyền:**
  - Sử dụng **JSON Web Tokens (JWT)** để xác thực người dùng.
  - Xây dựng **Middleware** để bảo vệ các route, yêu cầu đăng nhập và phân quyền theo vai trò (`user` vs `admin`).
- **Tương tác Database:**
  - Sử dụng **Mongoose** ODM để làm việc với MongoDB một cách hiệu quả và an toàn.
  - Thiết kế Schema tối ưu để lưu trữ dữ liệu sản phẩm, đơn hàng (lưu lại giá tại thời điểm mua), và thông tin người dùng.
- **Xử lý logic nghiệp vụ phức tạp:** Tầng Service xử lý các tác vụ như kiểm tra tồn kho, tính toán tổng tiền, giảm số lượng sản phẩm sau khi đặt hàng, và xóa giỏ hàng.

## 🚀 Công nghệ sử dụng

- **Framework:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) với dịch vụ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Object Data Modeling (ODM):** [Mongoose](https://mongoosejs.com/)
- **Xác thực:** JSON Web Token ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)) & [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- **Xử lý Biến môi trường:** [dotenv](https://github.com/motdotla/dotenv)

## 🛠️ Hướng dẫn cài đặt và chạy dự án

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/parfum_shop_backend.git
   ```

2. **Cài đặt dependencies:**
   ```bash
   cd parfum_shop_backend
   npm install
   ```

3. **Cấu hình biến môi trường:**
   - Tạo một file `.env` ở thư mục gốc.
   - Thêm vào các biến sau:
     ```
     PORT=8080
     MONGODB_URI=mongodb+srv://...your-connection-string...
     JWT_SECRET=your_super_secret_jwt_key
     ```

4. **Chạy dự án:**
   - Để chạy với chế độ development (tự động restart khi có thay đổi):
     ```bash
     npm run dev
     ```
   - Để chạy với chế độ production:
     ```bash
     npm start
     ```
   Server sẽ khởi động tại `http://localhost:8080`.