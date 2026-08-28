import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const quantity = Number(searchParams.get("quantity")) || 1;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8070/clothing-store/backend/api/products.php?id=${id}`)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    setProduct(result.data);
                }
            })
            .catch(error => console.error("Lỗi:", error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <h2>Đang tải...</h2>;
    }

    if (!product) {
        return <h2>Không tìm thấy sản phẩm</h2>;
    }

    const price = Number(product.gia);
    const totalPrice = price * quantity;

    return (
        <div className="checkout">
            <h1>Thanh toán</h1>

            <div className="checkout-content">
                <div className="checkout-form">
                    <h2>Thông tin nhận hàng</h2>

                    <input type="text" placeholder="Họ và tên" />
                    <input type="text" placeholder="Số điện thoại" />
                    <input type="text" placeholder="Địa chỉ nhận hàng" />
                    <textarea placeholder="Ghi chú"></textarea>
                    <h2>Phương thức thanh toán</h2>
                    
                    <label>
                        <input type="radio" name="payment" value="cod" defaultChecked />
                        Thanh toán khi nhận hàng
                    </label>
                    
                    <label>
                        <input type="radio" name="payment" value="bank" />
                        Chuyển khoản ngân hàng
                    </label>
                </div>

                <div className="checkout-summary">
                    <h2>Đơn hàng</h2>

                    <img
                        src={`http://localhost:8070/clothing-store/backend/images/${product.hinh_anh}`}
                        alt={product.ten_sp}
                    />

                    <h3>{product.ten_sp}</h3>

                    <p>Đơn giá: {price.toLocaleString("vi-VN")} VNĐ</p>
                    <p>Số lượng: {quantity}</p>

                    <hr />

                    <h2>
                        Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VNĐ
                    </h2>

                    <button className="order-button">Đặt hàng</button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;