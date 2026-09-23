import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Đợi một chút để đảm bảo order đã được tạo
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [orderId]);

    if (loading) {
        return <h2>Đang xác nhận đơn hàng...</h2>;
    }

    if (error) {
        return (
            <div className="order-confirmation-error">
                <h2>Có lỗi xảy ra</h2>
                <p>Không thể xác nhận đơn hàng của bạn.</p>
                <Link to="/" className="back-home-button">Về trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="order-confirmation">
            <div className="success-icon">✓</div>
            <h1>Đặt hàng thành công!</h1>
            <p className="order-id">Mã đơn hàng: #{orderId}</p>
            
            <div className="confirmation-message">
                <p>Cảm ơn bạn đã đặt hàng!</p>
                <p>Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.</p>
                <p>Bạn sẽ nhận được cuộc gọi xác nhận từ chúng tôi trong 24 giờ.</p>
            </div>

            <div className="confirmation-actions">
                <Link to="/" className="continue-shopping-button">
                    Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}

export default OrderConfirmation;
