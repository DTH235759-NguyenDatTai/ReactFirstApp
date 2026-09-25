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
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Vui lòng nhập email và mật khẩu"
            ]);
            exit();
        }
        
        // Tìm user theo email
        $sql = "SELECT * FROM taikhoan WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Kiểm tra user có tồn tại không
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Email hoặc mật khẩu không đúng"
            ]);
            exit();
        }
        
        // Kiểm tra password
        if (!password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Email hoặc mật khẩu không đúng"
            ]);
            exit();
        }
        
        // Đăng nhập thành công - trả về thông tin user (không trả password)
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công",
            "data" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
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
