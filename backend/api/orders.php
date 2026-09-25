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
        
        // Validate số điện thoại
        if (!preg_match('/^[0-9]{10,11}$/', $data['phone'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Số điện thoại không hợp lệ"
            ]);
            exit();
        }
        
        // Xử lý đơn hàng từ giỏ hàng (nhiều sản phẩm) hoặc mua ngay (1 sản phẩm)
        $orderItems = [];
        
        if (isset($data['items']) && is_array($data['items'])) {
            // Đơn hàng từ giỏ hàng
            foreach ($data['items'] as $item) {
                if (empty($item['productId']) || empty($item['quantity'])) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false,
                        "message" => "Thông tin sản phẩm không hợp lệ"
                    ]);
                    exit();
                }
                $orderItems[] = [
                    'productId' => $item['productId'],
                    'quantity' => $item['quantity']
                ];
            }
        } else if (isset($data['productId']) && isset($data['quantity'])) {
            // Mua ngay 1 sản phẩm
            $orderItems[] = [
                'productId' => $data['productId'],
                'quantity' => $data['quantity']
            ];
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Thông tin đơn hàng không hợp lệ"
            ]);
            exit();
        }
        
        // Lấy thông tin tất cả sản phẩm và validate
        $products = [];
        $totalPrice = 0;
        
        foreach ($orderItems as $item) {
            $sqlProduct = "SELECT * FROM sanpham WHERE id = ?";
            $stmtProduct = $conn->prepare($sqlProduct);
            $stmtProduct->execute([$item['productId']]);
            $product = $stmtProduct->fetch(PDO::FETCH_ASSOC);
            
            if (!$product) {
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "Không tìm thấy sản phẩm ID: " . $item['productId']
                ]);
                exit();
            }
            
            // Kiểm tra số lượng tồn kho
            if ($item['quantity'] > $product['soluong']) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Sản phẩm '{$product['ten_sp']}' không đủ số lượng. Chỉ còn {$product['soluong']} sản phẩm"
                ]);
                exit();
            }
            
            $products[] = [
                'product' => $product,
                'quantity' => $item['quantity']
            ];
            
            $totalPrice += $product['gia'] * $item['quantity'];
        }
        
        // Bắt đầu transaction
        $conn->beginTransaction();
        
        try {
            // Tạo đơn hàng
            $userId = isset($data['userId']) ? $data['userId'] : null;
            
            $sqlOrder = "INSERT INTO donhang (id_nguoidat, ten_khachhang, so_dienthoai, dia_chi, ghi_chu, phuong_thuc_thanhtoan, tong_tien, trang_thai) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, 'dang_xu_ly')";
            
            $stmtOrder = $conn->prepare($sqlOrder);
            $stmtOrder->execute([
                $userId,
                $data['name'],
                $data['phone'],
                $data['address'],
                $data['note'] ?? '',
                $data['payment'] ?? 'cod',
                $totalPrice
            ]);
            
            $orderId = $conn->lastInsertId();
            
            // Thêm chi tiết đơn hàng và cập nhật tồn kho
            foreach ($products as $item) {
                $product = $item['product'];
                $quantity = $item['quantity'];
                
                // Thêm chi tiết đơn hàng
                $sqlOrderDetail = "INSERT INTO chitietdonhang (id_donhang, id_sanpham, so_luong, don_gia) 
                                   VALUES (?, ?, ?, ?)";
                
                $stmtOrderDetail = $conn->prepare($sqlOrderDetail);
                $stmtOrderDetail->execute([
                    $orderId,
                    $product['id'],
                    $quantity,
                    $product['gia']
                ]);
                
                // Cập nhật số lượng tồn kho
                $sqlUpdateStock = "UPDATE sanpham SET soluong = soluong - ? WHERE id = ?";
                $stmtUpdateStock = $conn->prepare($sqlUpdateStock);
                $stmtUpdateStock->execute([$quantity, $product['id']]);
            }
            
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
                    "itemCount" => count($products)
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
