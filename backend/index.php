<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/db.php';

// Pega o endpoint via parâmetro 'route' ou pela URL amigável
$endpoint = isset($_GET['route']) ? '/' . $_GET['route'] : '';

if (empty($endpoint)) {
    $request_uri = $_SERVER['REQUEST_URI'];
    $script_name = $_SERVER['SCRIPT_NAME'];
    $base_path = str_replace('index.php', '', $script_name);
    $path = str_replace($base_path, '', $request_uri);
    $endpoint = '/' . ltrim(explode('?', $path)[0], '/');
    $endpoint = str_replace('index.php/', '', $endpoint);
    $endpoint = '/' . ltrim($endpoint, '/');
}

// Roteador
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
