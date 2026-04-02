<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Desativar exibição de erros HTML para não quebrar o JSON do React
ini_set('display_errors', 0);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once 'config/db.php';

    // Tenta descobrir o endpoint de forma flexível
    $request_uri = $_SERVER['REQUEST_URI'];
    
    if (isset($_GET['route'])) {
        $endpoint = '/' . $_GET['route'];
    } else {
        // Se vier como /api/products ou /backend/products
        $parts = explode('/', trim($request_uri, '/'));
        $endpoint = '/' . end($parts);
    }

    // Limpa query string do endpoint se existir
    $endpoint = explode('?', $endpoint)[0];

    switch ($endpoint) {
        case '/products':
            require 'api/products.php';
            break;
        case '/categories':
            require 'api/categories.php';
            break;
        case '/coupons':
            require 'api/coupons.php';
            break;
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
    echo json_encode(["error" => "Erro interno no servidor", "message" => $e->getMessage()]);
}
