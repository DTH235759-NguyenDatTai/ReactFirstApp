<?php

header("Access-Control-Allow-Origin: http://localhost:5173"); // do php chạy theo 127.0.0.1 còn react chạy localhost nên cần dòng này
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";

header("Content-Type: application/json; charset=UTF-8");

try {
    $sql = "SELECT * FROM sanpham";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $products
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}