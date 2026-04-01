<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS requests (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/db.php';

$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/backend/index.php'; // Adjust this according to your server configuration
$endpoint = str_replace($base_path, '', $request_uri);
$endpoint = explode('?', $endpoint)[0]; // Remove query string

// Simple router
switch ($endpoint) {
    case '/products':
        require 'api/products.php';
        break;
    case '/categories':
        require 'api/categories.php';
        break;
    case '/coupons':
        require 'api/coupons.php'; // Vou criar em seguida
        break;
    case '/auth':
        require 'api/auth.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found", "endpoint" => $endpoint]);
        break;
}
