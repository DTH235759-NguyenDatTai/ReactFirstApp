import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const totalPrice = getTotalPrice();

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Giỏ hàng trống</h2>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                <Link to="/" className="continue-shopping">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    const handleCheckout = () => {
        navigate("/cart-checkout");
    };

    return (
        <div className="cart-page">
            <h1>Giỏ hàng của bạn</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map((item) => {
                        const itemTotal = Number(item.gia) * item.quantity;
                        return (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={`http://localhost:8070/clothing-store/backend/images/${item.hinh_anh}`}
                                    alt={item.ten_sp}
                                    className="cart-item-image"
                                />

                                <div className="cart-item-details">
                                    <h3>{item.ten_sp}</h3>
                                    <p className="cart-item-price">
                                        {Number(item.gia).toLocaleString("vi-VN")} VNĐ
                                    </p>
                                    <p className="cart-item-stock">
                                        Còn {item.soluong} sản phẩm
                                    </p>
                                </div>

                                <div className="cart-item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.soluong}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item-total">
                                    <p>{itemTotal.toLocaleString("vi-VN")} VNĐ</p>
                                </div>

                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary">
                    <h2>Tổng đơn hàng</h2>
                    
                    <div className="cart-summary-details">
                        <div className="summary-row">
                            <span>Tạm tính:</span>
                            <span>{totalPrice.toLocaleString("vi-VN")} VNĐ</span>
                        </div>
                        <div className="summary-row">
                            <span>Phí vận chuyển:</span>
                            <span>Miễn phí</span>
                        </div>
                        <hr />
                        <div className="summary-row total">
                            <span>Tổng cộng:</span>
                            <span>{totalPrice.toLocaleString("vi-VN")} VNĐ</span>
                        </div>
                    </div>

                    <button className="checkout-button" onClick={handleCheckout}>
                        Thanh toán
                    </button>

                    <button className="clear-cart-button" onClick={clearCart}>
                        Xóa giỏ hàng
                    </button>

                    <Link to="/" className="continue-shopping">
                        ← Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;
