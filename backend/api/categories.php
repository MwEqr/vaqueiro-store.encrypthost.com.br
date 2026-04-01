<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\categories.php

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Buscar categorias via WooCommerce REST API
    $url = WC_STORE_URL . '/wp-json/wc/v3/products/categories';
    $auth = base64_encode(WC_CONSUMER_KEY . ':' . WC_CONSUMER_SECRET);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url . '?per_page=100');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Basic ' . $auth,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200) {
        $wc_categories = json_decode($response);
        $formatted = [];
        foreach ($wc_categories as $cat) {
            if ($cat->slug !== 'uncategorized') {
                $formatted[] = [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'count' => $cat->count
                ];
            }
        }
        echo json_encode($formatted);
    } else {
        http_response_code($http_code);
        echo json_encode(["error" => "Falha ao buscar categorias"]);
    }
}
