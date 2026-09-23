import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const quantity = Number(searchParams.get("quantity")) || 1;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [payment, setPayment] = useState("cod");
    const [error, setError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim() || !address.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin nhận hàng.");
            return;
        }

        if (!/^[0-9]{10,11}$/.test(phone)) {
            setError("Số điện thoại không hợp lệ.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const response = await fetch(
                "http://localhost:8070/clothing-store/backend/api/orders.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: id,
                        quantity: quantity,
                        name: name,
                        phone: phone,
                        address: address,
                        note: note,
                        payment: payment
                    })
                }
            );

            const result = await response.json();

            if (result.success) {
                // Chuyển đến trang xác nhận đơn hàng
                navigate(`/order-confirmation/${result.data.orderId}`);
            } else {
                setError(result.message || "Có lỗi xảy ra khi đặt hàng.");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            setError("Không thể kết nối đến server. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="checkout-form" onSubmit={handleSubmit}>
            <h1>Thanh toán</h1>

            <div className="checkout-content">
                <div className="checkout-form">
                    <h2>Thông tin nhận hàng</h2>

                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Địa chỉ nhận hàng"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <textarea
                        placeholder="Ghi chú"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                    {error && <p className="checkout-error">{error}</p>}
                    <h2>Phương thức thanh toán</h2>
                    
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={payment === "cod"}
                            onChange={(e) => setPayment(e.target.value)}
                        />
                        Thanh toán khi nhận hàng
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="bank"
                            checked={payment === "bank"}
                            onChange={(e) => setPayment(e.target.value)}
                        />
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

                    <button type="submit" className="order-button" disabled={submitting}>
                        {submitting ? "Đang xử lý..." : "Đặt hàng"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Checkout;