<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";

try {
    // Kiểm tra URL có truyền id hay không
    if (isset($_GET["id"])) {

        $id = $_GET["id"];

        // Lấy một sản phẩm theo id
        $sql = "SELECT * FROM sanpham WHERE id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);

        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            echo json_encode([
                "success" => true,
                "data" => $product
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Không tìm thấy sản phẩm"
            ]);
        }

    } else {

        // Nếu không có id thì lấy tất cả sản phẩm
        $sql = "SELECT * FROM sanpham";

        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $products
        ]);
    }

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}