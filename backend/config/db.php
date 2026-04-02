<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\config\db.php

$host = '127.0.0.1';
$dbname = 'vaqueiro_wp_db';
$username = 'vaqueiro_user';
$password = 'Vaqueiro@2025!'; // Senha da VPS

// WooCommerce API Credentials
define('WC_CONSUMER_KEY', 'ck_b280eea6517b8e12b0788e66695e32f30221fed1');
define('WC_CONSUMER_SECRET', 'cs_30805456c70c329721448a82ca4eaeec5668cdfd');
// Usamos localhost interno para o WordPress na VPS
define('WC_STORE_URL', 'http://localhost/wordpress'); 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Se falhar, retorna JSON em vez de erro HTML
    header('Content-Type: application/json');
    echo json_encode(["error" => "Falha na conexão com o banco", "details" => $e->getMessage()]);
    exit;
}
