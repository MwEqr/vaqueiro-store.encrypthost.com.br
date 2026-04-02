<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Bloqueia qualquer erro HTML de sair e quebrar o React
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if (!file_exists('config/db.php')) {
        throw new Exception("Arquivo config/db.php nao encontrado");
    }
    require_once 'config/db.php';

    $request_uri = $_SERVER['REQUEST_URI'];
    $parts = explode('/', trim($request_uri, '/'));
    $endpoint = '/' . end($parts);
    $endpoint = explode('?', $endpoint)[0];

    // Se o Nginx passar via query string ?route=
    if (isset($_GET['route'])) {
        $endpoint = '/' . $_GET['route'];
    }

    switch ($endpoint) {
        case '/products':
            require 'api/products.php';
            break;
        case '/categories':
            require 'api/categories.php';
            break;
        case '/coupons':
            require 'api/coupons.php';
            break; // Break adicionado
        case '/auth':
            require 'api/auth.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(["error" => "Rota nao encontrada", "endpoint" => $endpoint]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Erro critico no Backend",
        "message" => $e->getMessage()
    ]);
}
