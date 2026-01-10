Fitur Utama:
1. Manajemen User

Tabel users dengan autentikasi
Multiple alamat pengiriman per user
Profile dan status user

2. Katalog Produk

Kategori berlevel (parent-child)
Brand/merk produk
Multiple gambar per produk
Variasi produk (ukuran, warna, dll)
SKU tracking

3. Shopping Experience

Keranjang belanja
Wishlist
Review & rating dengan foto
Produk featured dan trending

4. Sistem Pesanan

Order management lengkap
Status tracking (pending → delivered)
Riwayat pembelian
Pembatalan pesanan

5. Pembayaran & Pengiriman

Multiple payment methods
Payment tracking
Shipping methods & cost
Tracking number

6. Promosi & Marketing

Voucher/coupon system
Discount percentage/fixed
Usage limit per user
Banner management

7. Admin Panel

Multi-level admin (super admin, admin, staff)
Settings management
Notifications system

8. Reporting

Views untuk statistik produk
View pesanan terbaru
Stored procedures untuk operasi umum


-- ============================================
-- DATABASE ONLINE SHOP
-- ============================================

-- Buat database
CREATE DATABASE IF NOT EXISTS online_shop;
USE online_shop;

-- ============================================
-- TABEL USERS & AUTHENTICATION
-- ============================================

-- Tabel Users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    gender ENUM('L', 'P') COMMENT 'L=Laki-laki, P=Perempuan',
    profile_image VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Tabel Alamat User
CREATE TABLE user_addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    label VARCHAR(50) COMMENT 'Rumah, Kantor, dll',
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- ============================================
-- TABEL KATEGORI & PRODUK
-- ============================================

-- Tabel Kategori Produk
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INT NULL COMMENT 'Untuk sub-kategori',
    description TEXT,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_parent (parent_id),
    INDEX idx_slug (slug)
);

-- Tabel Brand
CREATE TABLE brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
);

-- Tabel Produk
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    brand_id INT,
    product_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(12,2) NOT NULL,
    discount_price DECIMAL(12,2),
    stock INT DEFAULT 0,
    weight INT COMMENT 'Berat dalam gram',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_brand (brand_id),
    INDEX idx_slug (slug),
    INDEX idx_price (price),
    INDEX idx_stock (stock)
);

-- Tabel Gambar Produk
CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
);

-- Tabel Variasi Produk (Size, Color, dll)
CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(50) NOT NULL COMMENT 'Size, Color, dll',
    variant_value VARCHAR(50) NOT NULL COMMENT 'M, L, XL / Merah, Biru, dll',
    sku VARCHAR(100),
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    UNIQUE KEY unique_variant (product_id, variant_name, variant_value)
);

-- ============================================
-- TABEL KERANJANG & WISHLIST
-- ============================================

-- Tabel Keranjang Belanja
CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    UNIQUE KEY unique_cart_item (user_id, product_id, variant_id)
);

-- Tabel Wishlist
CREATE TABLE wishlist (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- ============================================
-- TABEL PESANAN
-- ============================================

-- Tabel Orders
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    
    -- Alamat pengiriman
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    
    -- Biaya
    subtotal DECIMAL(12,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    
    payment_method VARCHAR(50),
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    
    notes TEXT,
    cancelled_at TIMESTAMP NULL,
    cancel_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- Tabel Order Items
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    product_name VARCHAR(255) NOT NULL,
    variant_info VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
    INDEX idx_order (order_id)
);

-- ============================================
-- TABEL PEMBAYARAN
-- ============================================

-- Tabel Payments
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'success', 'failed', 'expired') DEFAULT 'pending',
    amount DECIMAL(12,2) NOT NULL,
    payment_code VARCHAR(100),
    payment_proof VARCHAR(255),
    paid_at TIMESTAMP NULL,
    expired_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_status (payment_status)
);

-- ============================================
-- TABEL REVIEW & RATING
-- ============================================

-- Tabel Reviews
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_user (user_id),
    UNIQUE KEY unique_review (product_id, user_id, order_id)
);

-- Tabel Review Images
CREATE TABLE review_images (
    review_image_id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    INDEX idx_review (review_id)
);

-- ============================================
-- TABEL VOUCHER & PROMOSI
-- ============================================

-- Tabel Vouchers/Coupons
CREATE TABLE vouchers (
    voucher_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(12,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    usage_limit INT COMMENT 'Total penggunaan maksimal',
    used_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1 COMMENT 'Limit per user',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_dates (start_date, end_date)
);

-- Tabel Voucher Usage
CREATE TABLE voucher_usage (
    usage_id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_voucher (voucher_id),
    INDEX idx_user (user_id)
);

-- ============================================
-- TABEL ADMIN
-- ============================================

-- Tabel Admin Users
CREATE TABLE admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'staff') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- ============================================
-- TABEL BANNER & CONTENT
-- ============================================

-- Tabel Banners
CREATE TABLE banners (
    banner_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    position VARCHAR(50) COMMENT 'home_slider, sidebar, popup, dll',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_active (is_active)
);

-- ============================================
-- TABEL SHIPPING
-- ============================================

-- Tabel Shipping Methods
CREATE TABLE shipping_methods (
    shipping_id INT PRIMARY KEY AUTO_INCREMENT,
    method_name VARCHAR(100) NOT NULL,
    courier VARCHAR(50) NOT NULL COMMENT 'JNE, TIKI, POS, dll',
    description TEXT,
    base_cost DECIMAL(10,2) NOT NULL,
    per_kg_cost DECIMAL(10,2) DEFAULT 0,
    estimated_days VARCHAR(20) COMMENT '2-3 hari',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_courier (courier)
);

-- ============================================
-- TABEL NOTIFICATIONS
-- ============================================

-- Tabel Notifications
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'order_status, promo, general',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);

-- ============================================
-- TABEL SETTINGS
-- ============================================

-- Tabel Settings
CREATE TABLE settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
);

-- ============================================
-- INSERT DATA SAMPLE
-- ============================================

-- Insert sample categories
INSERT INTO categories (category_name, slug, description) VALUES
('Elektronik', 'elektronik', 'Produk elektronik dan gadget'),
('Fashion Pria', 'fashion-pria', 'Pakaian dan aksesoris pria'),
('Fashion Wanita', 'fashion-wanita', 'Pakaian dan aksesoris wanita'),
('Rumah Tangga', 'rumah-tangga', 'Peralatan rumah tangga'),
('Olahraga', 'olahraga', 'Peralatan olahraga dan fitness');

-- Insert sample brands
INSERT INTO brands (brand_name, slug, description) VALUES
('Samsung', 'samsung', 'Brand elektronik ternama'),
('Nike', 'nike', 'Brand olahraga terkemuka'),
('Adidas', 'adidas', 'Brand olahraga internasional'),
('Uniqlo', 'uniqlo', 'Brand fashion Jepang');

-- Insert sample admin
INSERT INTO admin_users (username, email, password, full_name, role) VALUES
('admin', 'admin@onlineshop.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'super_admin');
-- Password: password (harus di-hash dengan proper hashing)

-- Insert sample settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'My Online Shop', 'Nama toko online'),
('site_email', 'info@onlineshop.com', 'Email toko'),
('site_phone', '021-12345678', 'Nomor telepon toko'),
('tax_percentage', '11', 'Persentase pajak (PPN)'),
('free_shipping_min', '100000', 'Minimum pembelian untuk gratis ongkir');

-- ============================================
-- VIEWS UNTUK REPORTING
-- ============================================

-- View untuk statistik produk
CREATE VIEW v_product_stats AS
SELECT 
    p.product_id,
    p.product_name,
    p.price,
    p.stock,
    p.views,
    p.sold_count,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(DISTINCT r.review_id) as review_count
FROM products p
LEFT JOIN reviews r ON p.product_id = r.product_id AND r.is_approved = TRUE
GROUP BY p.product_id;

-- View untuk pesanan terbaru
CREATE VIEW v_recent_orders AS
SELECT 
    o.order_id,
    o.order_number,
    o.order_date,
    o.status,
    o.total,
    u.full_name as customer_name,
    u.email as customer_email,
    COUNT(oi.order_item_id) as total_items
FROM orders o
JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id
ORDER BY o.order_date DESC;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure untuk mengurangi stok produk
CREATE PROCEDURE sp_reduce_stock(
    IN p_product_id INT,
    IN p_variant_id INT,
    IN p_quantity INT
)
BEGIN
    IF p_variant_id IS NULL THEN
        UPDATE products 
        SET stock = stock - p_quantity,
            sold_count = sold_count + p_quantity
        WHERE product_id = p_product_id;
    ELSE
        UPDATE product_variants 
        SET stock = stock - p_quantity
        WHERE variant_id = p_variant_id;
        
        UPDATE products 
        SET sold_count = sold_count + p_quantity
        WHERE product_id = p_product_id;
    END IF;
END //

-- Procedure untuk membuat nomor order
CREATE PROCEDURE sp_generate_order_number(OUT order_num VARCHAR(50))
BEGIN
    DECLARE today VARCHAR(8);
    DECLARE counter INT;
    
    SET today = DATE_FORMAT(NOW(), '%Y%m%d');
    
    SELECT COUNT(*) + 1 INTO counter
    FROM orders
    WHERE DATE(order_date) = CURDATE();
    
    SET order_num = CONCAT('ORD-', today, '-', LPAD(counter, 4, '0'));
END //

DELIMITER ;

-- ============================================
-- INDEXES TAMBAHAN UNTUK OPTIMASI
-- ============================================

-- Composite indexes untuk query yang sering digunakan
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_featured ON products(is_featured, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_date_status ON orders(order_date, status);

-- ============================================
-- SELESAI
-- ============================================
