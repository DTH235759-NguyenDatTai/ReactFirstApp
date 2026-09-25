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
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        // Lấy userId từ query parameter
        if (empty($_GET['userId'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Thiếu thông tin user"
            ]);
            exit();
        }
        
        $userId = $_GET['userId'];
        
        // Lấy tất cả đơn hàng của user
        $sqlOrders = "SELECT * FROM donhang WHERE id_nguoidat = ? ORDER BY ngay_dat DESC";
        $stmtOrders = $conn->prepare($sqlOrders);
        $stmtOrders->execute([$userId]);
        $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);
        
        // Lấy chi tiết từng đơn hàng
        foreach ($orders as &$order) {
            $sqlDetails = "SELECT cd.*, sp.ten_sp, sp.hinh_anh 
                          FROM chitietdonhang cd 
                          JOIN sanpham sp ON cd.id_sanpham = sp.id 
                          WHERE cd.id_donhang = ?";
            $stmtDetails = $conn->prepare($sqlDetails);
            $stmtDetails->execute([$order['id']]);
            $order['items'] = $stmtDetails->fetchAll(PDO::FETCH_ASSOC);
        }
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $orders
        ]);
        
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
