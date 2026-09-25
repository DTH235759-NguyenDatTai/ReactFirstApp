import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}

export function CartProvider({ children }) {
    // Lấy giỏ hàng từ localStorage khi khởi động
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Lưu giỏ hàng vào localStorage mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Thêm sản phẩm vào giỏ
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Nếu có rồi thì tăng số lượng
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Nếu chưa có thì thêm mới
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter(item => item.id !== productId)
        );
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính tổng số lượng sản phẩm
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng tiền
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => 
            total + (Number(item.gia) * item.quantity), 0
        );
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
