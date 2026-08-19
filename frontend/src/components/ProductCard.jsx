
function ProductCard({ product }){
    return(
        <div>
            <h2>{product.ten_sp}</h2>

            <p>Giá: {Number(product.gia).toLocaleString("vi-VN")} VNĐ </p>
            
            <p>Số lượng: {product.soluong}</p>

            <button>Xem chi tiết</button>
        </div>
    );
}

export default ProductCard;