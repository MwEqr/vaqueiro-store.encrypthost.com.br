<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\products.php

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Buscar produtos via WooCommerce REST API
    $url = WC_STORE_URL . '/wp-json/wc/v3/products';
    $auth = base64_encode(WC_CONSUMER_KEY . ':' . WC_CONSUMER_SECRET);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url . '?per_page=100');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Basic ' . $auth,
        'Content-Type: application/json'
    ]);
    // Disable SSL verification for localhost if needed
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200) {
        $wc_products = json_decode($response);
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
                'sizes' => ['P', 'M', 'G', 'GG'], // WooCommerce variações poderiam ser mapeadas aqui
                'colors' => ['Natural', 'Marrom', 'Preto'],
                'description' => strip_tags($product->description),
                'details' => [
                    'material' => 'Couro Legítimo',
                    'forro' => 'Interno Confort',
                    'cuidados' => 'Limpar com pano úmido',
                    'origem' => 'Nacional'
                ],
                'tag' => $product->on_sale ? 'Promoção' : null
            ];
        }

        echo json_encode($formatted_products);
    } else {
        http_response_code($http_code);
        echo json_encode(["error" => "Falha ao buscar produtos no WooCommerce", "details" => $response]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
