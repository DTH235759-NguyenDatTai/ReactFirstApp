import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CartCheckout() {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Nếu giỏ hàng trống, chuyển về trang chủ
  if (cartItems.length === 0) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (orderData) => {
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
            items: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            })),
            ...orderData
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        clearCart();
        // Chuyển đến trang xác nhận đơn hàng
        navigate(`/order-confirmation/${result.data.orderId}`);
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi đặt hàng.");
      }
    } catch (error) {
      // Error will be caught and set via setError in CheckoutForm
      throw error;
    }
  };

  return (
    <CheckoutForm
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
      defaultName={isAuthenticated() ? user.name : ""}
      cartItems={cartItems}
    />
  );
}

export default CartCheckout;