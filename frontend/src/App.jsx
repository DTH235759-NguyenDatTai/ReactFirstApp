import { useEffect, useState } from "react";

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8070/clothing-store/backend/api/products.php")
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    setProducts(result.data);
                }
            })
            .catch(error => {
                console.error("Lỗi:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Đang tải sản phẩm...</h2>;
    }

    return (
        <div>
            <h1>Clothing Store</h1>

            <div>
                {products.map(product => (
                    <div key={product.id}>
                        <h2>{product.ten_sp}</h2>
                        <p>{product.gia} VNĐ</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;