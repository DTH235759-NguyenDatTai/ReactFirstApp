import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }) {
    // Lấy user từ localStorage khi khởi động
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);

    // Lưu user vào localStorage mỗi khi thay đổi
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Đăng ký
    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8070/clothing-store/backend/api/register.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password })
                }
            );

            const result = await response.json();

            if (result.success) {
                setUser(result.data);
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, message: "Không thể kết nối đến server" };
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8070/clothing-store/backend/api/login.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const result = await response.json();

            if (result.success) {
                setUser(result.data);
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Không thể kết nối đến server" };
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    // Kiểm tra user đã đăng nhập chưa
    const isAuthenticated = () => {
        return user !== null;
    };

    // Kiểm tra user có phải admin không
    const isAdmin = () => {
        return user && user.role === "admin";
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
