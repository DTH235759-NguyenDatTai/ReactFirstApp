import CheckoutForm from "../components/CheckoutForm";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const quantity = Number(searchParams.get("quantity")) || 1;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (orderData) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8070/clothing-store/backend/api/orders.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: isAuthenticated() ? user.id : null,
            productId: id,
            quantity: quantity,
            ...orderData
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        // Chuyển đến trang xác nhận đơn hàng
        navigate(`/order-confirmation/${result.data.orderId}`);
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi đặt hàng.");
      }
    } catch (err) {
      setError(err.message || "Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CheckoutForm
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      setError={setError}
      defaultName={isAuthenticated() ? user.name : ""}
      cartItems={[{ ...product, quantity }]}
    />
  );
}

export default Checkout;