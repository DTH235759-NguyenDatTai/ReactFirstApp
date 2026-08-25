import "./ProductDetail.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; /* dùng để chuyển trang trong react */

function ProductsDetail(){
    const { id } = useParams();
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

    if(loading){
        return <h2>Đang tải sản phẩm....</h2>
    }

    if(!product){
        return <h2>Không tìm thấy sản phẩm</h2>
    }

    const formattedPrice = Number(product.gia).toLocaleString("vi-VN");

    return (
        <div className="product-detail">
            <img
                className="product-detail-image"
                src={`http://localhost:8070/clothing-store/backend/images/${product.hinh_anh}`}
                alt={product.ten_sp}
            />

            <div className="product-detail-info">
                <h1>{product.ten_sp}</h1>
                <p className="product-detail-price">{formattedPrice} VNĐ</p>
                <p className="product-detail-description">{product.mo_ta}</p>
                <p className="product-detail-stock">Còn {product.soluong} sản phẩm</p>

                <div className="product-actions">
                    <button className="cart-button">Thêm vào giỏ hàng</button>
                    <button className="buy-button">Thanh toán ngay</button>
                </div>
            </div>
        </div>
    );
}

export default ProductsDetail;