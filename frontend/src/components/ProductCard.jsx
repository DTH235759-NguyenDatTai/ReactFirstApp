
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

            {/* 
                Sau này chúng ta sẽ lấy ảnh từ database.
                Tạm thời sử dụng ảnh placeholder.
            */}
            <div className="product-image">
                <img
                    src="https://via.placeholder.com/300x350"
                    alt={product.ten_sp}
                />
            </div>


            {/* Thông tin sản phẩm */}
            <div className="product-info">

                {/* Tên sản phẩm lấy từ database */}
                <h3>
                    {product.ten_sp}
                </h3>

                {/* Giá sản phẩm */}
                <p className="product-price">
                    {formattedPrice} VNĐ
                </p>

                {/* Số lượng còn lại */}
                <p className="product-stock">
                    Còn {product.soluong} sản phẩm
                </p>


                {/* Các button */}
                <div className="product-buttons">

                    <button className="detail-button">
                        Xem chi tiết
                    </button>

                    <button className="cart-button">
                        Thêm vào giỏ
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;