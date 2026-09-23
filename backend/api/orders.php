<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // Lấy dữ liệu JSON từ request
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validate dữ liệu
        if (empty($data['name']) || empty($data['phone']) || empty($data['address'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Vui lòng nhập đầy đủ thông tin nhận hàng"
            ]);
            exit();
        }
        
        if (empty($data['productId']) || empty($data['quantity'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Thông tin sản phẩm không hợp lệ"
            ]);
            exit();
        }
        
        // Validate số điện thoại
        if (!preg_match('/^[0-9]{10,11}$/', $data['phone'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Số điện thoại không hợp lệ"
            ]);
            exit();
        }
        
        // Lấy thông tin sản phẩm
        $sqlProduct = "SELECT * FROM sanpham WHERE id = ?";
        $stmtProduct = $conn->prepare($sqlProduct);
        $stmtProduct->execute([$data['productId']]);
        $product = $stmtProduct->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Không tìm thấy sản phẩm"
            ]);
            exit();
        }
        
        // Kiểm tra số lượng tồn kho
        if ($data['quantity'] > $product['soluong']) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Số lượng sản phẩm không đủ. Chỉ còn " . $product['soluong'] . " sản phẩm"
            ]);
            exit();
        }
        
        // Tính tổng tiền
        $totalPrice = $product['gia'] * $data['quantity'];
        
        // Bắt đầu transaction
        $conn->beginTransaction();
        
        try {
            // Tạo đơn hàng (guest checkout - không cần id_nguoidat)
            $sqlOrder = "INSERT INTO donhang (id_nguoidat, ten_khachhang, so_dienthoai, dia_chi, ghi_chu, phuong_thuc_thanhtoan, tong_tien, trang_thai) 
                         VALUES (NULL, ?, ?, ?, ?, ?, ?, 'dang_xu_ly')";
            
            $stmtOrder = $conn->prepare($sqlOrder);
            $stmtOrder->execute([
                $data['name'],
                $data['phone'],
                $data['address'],
                $data['note'] ?? '',
                $data['payment'] ?? 'cod',
                $totalPrice
            ]);
            
            $orderId = $conn->lastInsertId();
            
            // Thêm chi tiết đơn hàng
            $sqlOrderDetail = "INSERT INTO chitietdonhang (id_donhang, id_sanpham, so_luong, don_gia) 
                               VALUES (?, ?, ?, ?)";
            
            $stmtOrderDetail = $conn->prepare($sqlOrderDetail);
            $stmtOrderDetail->execute([
                $orderId,
                $product['id'],
                $data['quantity'],
                $product['gia']
            ]);
            
            // Cập nhật số lượng tồn kho
            $sqlUpdateStock = "UPDATE sanpham SET soluong = soluong - ? WHERE id = ?";
            $stmtUpdateStock = $conn->prepare($sqlUpdateStock);
            $stmtUpdateStock->execute([$data['quantity'], $product['id']]);
            
            // Commit transaction
            $conn->commit();
            
            // Trả về kết quả thành công
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Đặt hàng thành công",
                "data" => [
                    "orderId" => $orderId,
                    "totalPrice" => $totalPrice,
                    "productName" => $product['ten_sp'],
                    "quantity" => $data['quantity']
                ]
            ]);
            
        } catch (Exception $e) {
            // Rollback nếu có lỗi
            $conn->rollBack();
            throw $e;
        }
        
    } else {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi server: " . $e->getMessage()
    ]);
}
