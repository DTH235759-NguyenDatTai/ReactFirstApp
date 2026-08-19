import { Link } from "react-router-dom";

function ProductCard({ product }) {

    // Chuyển giá từ database thành dạng tiền Việt.
    //
    // Ví dụ:
    // 150000
    //
    // sẽ trở thành:
    // 150.000
    const formattedPrice = Number(product.gia)
        .toLocaleString("vi-VN");


    return (
        <div className="product-card">

            <div className="product-image">
                <img
                    src={`http://127.0.0.1:8070/clothing-store/backend/images/${product.hinh_anh}`}
                    alt={product.ten_sp}
                />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="product-info">

                {/* Tên sản phẩm lấy từ database */}
                <h3> {product.ten_sp} </h3>

                {/* Giá sản phẩm */}
                <p className="product-price">{formattedPrice} VNĐ</p>

                <p className="product-stock">Còn {product.soluong} sản phẩm</p>

                <div className="product-buttons">

                    <Link
                        to={`/products/${product.id}`}
                        className="detail-button">Xem chi tiết    
                    </Link>

                    <button className="cart-button">Thêm vào giỏ</button>

                </div>
            </div>
        </div>
    );
}

export default ProductCard;