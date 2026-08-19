function Navbar(){
    return(
        <nav className="navbar">
            <div className="logo">Clothing Store</div>

            <div className="nav-links">
                <a href="#">Trang chủ</a>
                <a href="#">Sản phẩm</a>
                <a href="#">Giới thiệu</a>
                <a href="#">Liên hệ</a>
            </div>

            <div className="nav-actions">
                <button>🛒 Giỏ hàng</button>
                <button>Đăng nhập</button>
            </div>
        </nav>
    );
}

export default Navbar;