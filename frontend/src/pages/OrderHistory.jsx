import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

function OrderHistory() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Redirect nếu chưa đăng nhập
        if (!isAuthenticated()) {
            navigate("/login", { state: { from: { pathname: "/order-history" } } });
            return;
        }

        // Fetch order history
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8070/clothing-store/backend/api/user-orders.php?userId=${user.id}`
                );

                const result = await response.json();

                if (result.success) {
                    setOrders(result.data);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Không thể tải lịch sử đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, isAuthenticated, navigate]);

    const getStatusText = (status) => {
        const statusMap = {
            'dang_xu_ly': 'Đang xử lý',
            'da_giao': 'Đã giao',
            'huy': 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            'dang_xu_ly': 'status-pending',
            'da_giao': 'status-delivered',
            'huy': 'status-cancelled'
        };
        return classMap[status] || '';
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="empty-orders">
                <h2>Chưa có đơn hàng nào</h2>
                <p>Bạn chưa đặt hàng lần nào. Hãy bắt đầu mua sắm ngay!</p>
                <button onClick={() => navigate("/")} className="shop-now-button">
                    Mua sắm ngay
                </button>
            </div>
        );
    }

    return (
        <div className="order-history">
            <h1>Đơn hàng của tôi</h1>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Đơn hàng #{order.id}</h3>
                                <p className="order-date">
                                    {new Date(order.ngay_dat).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                            <span className={`order-status ${getStatusClass(order.trang_thai)}`}>
                                {getStatusText(order.trang_thai)}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <img
                                        src={`http://localhost:8070/clothing-store/backend/images/${item.hinh_anh}`}
                                        alt={item.ten_sp}
                                    />
                                    <div className="item-details">
                                        <h4>{item.ten_sp}</h4>
                                        <p>Số lượng: {item.so_luong}</p>
                                        <p className="item-price">
                                            {Number(item.don_gia).toLocaleString("vi-VN")} VNĐ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="order-details">
                                <p><strong>Người nhận:</strong> {order.ten_khachhang}</p>
                                <p><strong>Số điện thoại:</strong> {order.so_dienthoai}</p>
                                <p><strong>Địa chỉ:</strong> {order.dia_chi}</p>
                                {order.ghi_chu && <p><strong>Ghi chú:</strong> {order.ghi_chu}</p>}
                                <p><strong>Thanh toán:</strong> {order.phuong_thuc_thanhtoan === 'cod' ? 'COD' : 'Chuyển khoản'}</p>
                            </div>
                            <div className="order-total">
                                <strong>Tổng tiền:</strong>
                                <span className="total-price">
                                    {Number(order.tong_tien).toLocaleString("vi-VN")} VNĐ
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderHistory;
