import { useState } from "react";

export default function CheckoutForm({
  onSubmit,
  submitting,
  error,
  setError,
  defaultName = "",
  cartItems = []
}) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("cod");

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
    try {
      await onSubmit({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
        payment
      });
    } catch (err) {
      // If onSubmit throws an error, display it
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h1>Thanh toán</h1>
      <div className="checkout-content">
        <div className="checkout-form-section">
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
        {cartItems.length > 0 && (
          <div className="checkout-summary">
            <h2>Đơn hàng ({cartItems.length} sản phẩm)</h2>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={`http://localhost:8070/clothing-store/backend/images/${item.hinh_anh}`}
                    alt={item.ten_sp}
                  />
                  <div className="checkout-item-info">
                    <h4>{item.ten_sp}</h4>
                    <p>Số lượng: {item.quantity}</p>
                    <p className="checkout-item-price">
                      {(Number(item.gia) * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="checkout-total">
              <span>Tạm tính:</span>
              <span>{cartItems.reduce((t, i) => t + Number(item.gia) * i.quantity, 0).toLocaleString("vi-VN")} VNĐ</span>
            </div>
            <div className="checkout-total">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <hr />
            <h2 className="checkout-final-total">
              Tổng tiền: {cartItems.reduce((t, i) => t + Number(item.gia) * i.quantity, 0).toLocaleString("vi-VN")} VNĐ
            </h2>
          </div>
        )}
      </div>
    </form>
  );
}