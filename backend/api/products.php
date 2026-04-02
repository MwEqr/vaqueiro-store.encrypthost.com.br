<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\products.php

if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(["error" => "Extensao CURL nao instalada no servidor PHP da VPS"]);
    exit;
}

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $url = WC_STORE_URL . '/wp-json/wc/v3/products';
    $auth = base64_encode(WC_CONSUMER_KEY . ':' . WC_CONSUMER_SECRET);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url . '?per_page=100');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Basic ' . $auth,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($http_code === 200) {
        $wc_products = json_decode($response);
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(["error" => "WooCommerce retornou dados invalidos", "raw" => substr($response, 0, 200)]);
            exit;
        }
        
        $formatted_products = [];
        foreach ($wc_products as $product) {
            $formatted_products[] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float)$product->regular_price,
                'oldPrice' => $product->sale_price ? (float)$product->regular_price : null,
                'category' => !empty($product->categories) ? $product->categories[0]->name : 'Geral',
                'image' => !empty($product->images) ? $product->images[0]->src : '',
                'images' => array_map(function($img) { return $img->src; }, $product->images),
                'rating' => (float)$product->average_rating,
                'reviews' => $product->review_count,
                'sizes' => ['P', 'M', 'G', 'GG'],
                'colors' => ['Natural', 'Marrom', 'Preto'],
                'description' => strip_tags($product->description),
                'tag' => $product->on_sale ? 'Promoção' : null
            ];
        }
        echo json_encode($formatted_products);
    } else {
        http_response_code($http_code ?: 500);
        echo json_encode([
            "error" => "Erro ao conectar no WooCommerce", 
            "http_code" => $http_code,
            "curl_error" => $error,
            "wc_url" => $url
        ]);
    }
}
