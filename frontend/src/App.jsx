// useEffect:
// Dùng để thực hiện các tác vụ bên ngoài quá trình render,
// ở đây là gọi API PHP.
//
// useState:
// Dùng để lưu dữ liệu sản phẩm và trạng thái loading.
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";


function App() {

    // products dùng để lưu danh sách sản phẩm lấy từ PHP.
    //
    // Ban đầu chưa có sản phẩm nên để [].
    const [products, setProducts] = useState([]);


    // loading dùng để biết API đã tải xong chưa.
    //
    // Ban đầu là true vì chúng ta chưa lấy dữ liệu.
    const [loading, setLoading] = useState(true);


    // useEffect chạy sau khi component App được render.
    //
    // [] ở cuối có nghĩa:
    // chỉ chạy đoạn code này một lần khi App được tạo.
    useEffect(() => {

        // Gửi request GET tới PHP API
        fetch(
            "http://127.0.0.1:8070/clothing-store/backend/api/products.php"
        )

            // Chuyển response từ PHP thành JSON
            .then(response => response.json())

            // result chính là dữ liệu PHP trả về
            .then(result => {

                // Kiểm tra API có trả về thành công không
                if (result.success) {

                    // Lưu danh sách sản phẩm vào state products
                    //
                    // Khi setProducts() chạy,
                    // React sẽ render lại giao diện.
                    setProducts(result.data);
                }
            })

            // Nếu API xảy ra lỗi
            .catch(error => {

                console.error(
                    "Lỗi khi lấy sản phẩm:",
                    error
                );

            })

            // Dù thành công hay thất bại,
            // cuối cùng cũng tắt trạng thái loading.
            .finally(() => {

                setLoading(false);

            });

    }, []);


    // Trong lúc đang gọi API
    // hiển thị thông báo loading.
    if (loading) {
        return (
            <h2>
                Đang tải sản phẩm...
            </h2>
        );
    }


    return (
        <>

            {/* Thanh menu */}
            <Navbar />


            {/* Nội dung chính */}
            <main className="container">

                <h1 className="page-title">
                    Sản phẩm mới nhất
                </h1>


                {/* 
                    products là một Array.

                    map() sẽ duyệt qua từng sản phẩm
                    và tạo ra một ProductCard.
                */}
                <div className="product-grid">

                    {products.map(product => (

                        <ProductCard
                            key={product.id}
                            product={product}
                        />

                    ))}

                </div>

            </main>

        </>
    );
}

export default App;