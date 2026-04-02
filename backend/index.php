<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\index.php

ob_start(); // Captura qualquer erro ou aviso inesperado

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 0); 
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once 'config/db.php';

    $request_uri = $_SERVER['REQUEST_URI'];
    if (isset($_GET['route'])) {
        $endpoint = '/' . $_GET['route'];
    } else {
        $parts = explode('/', trim($request_uri, '/'));
        $endpoint = '/' . end($parts);
    }
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
        case '/upload':
            require 'api/upload.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(["error" => "Rota nao encontrada", "endpoint" => $endpoint]);
            break;
    }

} catch (Throwable $e) {
    ob_clean(); // Limpa qualquer erro HTML que tenha aparecido
    http_response_code(500);
    echo json_encode([
        "error" => "Erro no PHP",
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}

// Se houver algum lixo no buffer (avisos do PHP), limpa antes de enviar o JSON
$output = ob_get_clean();
if (!empty($output) && strpos($output, '{') === false) {
    // Se o que saiu nao for JSON, temos um erro escondido
    error_log("Saida inesperada: " . $output);
}
echo $output;
