import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const { getTotalItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const totalItems = getTotalItems();

    return(
        <nav className="navbar">
            <Link to="/" className="logo">Clothing Store</Link>

            <div className="nav-links">
                <Link to="/">Trang chủ</Link>
                <a href="#">Sản phẩm</a>
                <a href="#">Giới thiệu</a>
                <a href="#">Liên hệ</a>
            </div>

            <div className="nav-actions">
                <Link to="/cart">
                    <button>
                        🛒 Giỏ hàng {totalItems > 0 && `(${totalItems})`}
                    </button>
                </Link>
                
                {isAuthenticated() ? (
                    <div className="user-menu">
                        <span className="user-name">👤 {user.name}</span>
                        <div className="dropdown">
                            <Link to="/order-history">Đơn hàng của tôi</Link>
                            <button onClick={logout}>Đăng xuất</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login">
                        <button>Đăng nhập</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;