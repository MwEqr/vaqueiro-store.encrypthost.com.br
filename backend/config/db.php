<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\config\db.php

$host = '127.0.0.1';
$dbname = 'vaqueiro_wp_db';
$username = 'vaqueiro_user';
$password = ''; // Localhost sem senha por padrão

// WooCommerce API Credentials
define('WC_CONSUMER_KEY', 'ck_b280eea6517b8e12b0788e66695e32f30221fed1');
define('WC_CONSUMER_SECRET', 'cs_30805456c70c329721448a82ca4eaeec5668cdfd');
define('WC_STORE_URL', 'http://localhost/wordpress'); // Ajuste se a URL for diferente

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Silently handle connection error or log it
    error_log("Erro de conexão: " . $e->getMessage());
}
