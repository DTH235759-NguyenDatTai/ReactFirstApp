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
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Vui lòng nhập đầy đủ thông tin"
            ]);
            exit();
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Email không hợp lệ"
            ]);
            exit();
        }
        
        // Validate password length
        if (strlen($data['password']) < 6) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Mật khẩu phải có ít nhất 6 ký tự"
            ]);
            exit();
        }
        
        // Kiểm tra email đã tồn tại chưa
        $sqlCheck = "SELECT id FROM taikhoan WHERE email = ?";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->execute([$data['email']]);
        
        if ($stmtCheck->fetch()) {
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "message" => "Email đã được sử dụng"
            ]);
            exit();
        }
        
        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Tạo tài khoản mới
        $sqlInsert = "INSERT INTO taikhoan (name, email, password, role) VALUES (?, ?, ?, 'user')";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->execute([
            $data['name'],
            $data['email'],
            $hashedPassword
        ]);
        
        $userId = $conn->lastInsertId();
        
        // Trả về thông tin user (không trả password)
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Đăng ký thành công",
            "data" => [
                "id" => $userId,
                "name" => $data['name'],
                "email" => $data['email'],
                "role" => "user"
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
