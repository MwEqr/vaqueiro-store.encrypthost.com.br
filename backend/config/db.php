<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\config\db.php

$host = '127.0.0.1';
$dbname = 'vaqueiro_wp_db';
$username = 'root';
$password = '461xIBZazRtM'; 

// WooCommerce API Credentials
define('WC_CONSUMER_KEY', 'ck_b280eea6517b8e12b0788e66695e32f30221fed1');
define('WC_CONSUMER_SECRET', 'cs_30805456c70c329721448a82ca4eaeec5668cdfd');

// USAR A URL REAL DA VPS PARA O WOOCOMMERCE
define('WC_STORE_URL', 'https://vaqueiro-store.encrypthost.com.br/wordpress'); 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Falha na conexao com o banco", "details" => $e->getMessage()]);
    exit;
}
