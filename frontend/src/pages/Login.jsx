import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Lấy trang trước đó (nếu có) để redirect sau khi login
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate
        if (!email.trim() || !password) {
            setError("Vui lòng nhập email và mật khẩu");
            return;
        }

        // Gọi API login
        const result = await login(email, password);

        if (result.success) {
            // Đăng nhập thành công, chuyển về trang trước đó hoặc trang chủ
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Đăng nhập</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="auth-switch">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
