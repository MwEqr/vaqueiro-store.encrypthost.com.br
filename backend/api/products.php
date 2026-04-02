<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\products.php
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$url = WC_STORE_URL . '/wp-json/wc/v3/products';
$auth = base64_encode(WC_CONSUMER_KEY . ':' . WC_CONSUMER_SECRET);

function wc_curl($url, $method, $data = null) {
    global $auth;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    $headers = ['Authorization: Basic ' . $auth, 'Content-Type: application/json'];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => $res];
}

if ($method === 'GET') {
    $res = wc_curl($url . '?per_page=100', 'GET');
    if ($res['code'] === 200) {
        $wc_products = json_decode($res['body']);
        $formatted = [];
        foreach ($wc_products as $p) {
            $sizes = [];
            $colors = [];
            foreach($p->attributes as $attr) {
                if(strtolower($attr->name) == 'tamanho' || strtolower($attr->name) == 'tamanhos') $sizes = $attr->options;
                if(strtolower($attr->name) == 'cor' || strtolower($attr->name) == 'cores') $colors = $attr->options;
            }

            $formatted[] = [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float)$p->regular_price ?: (float)$p->price,
                'oldPrice' => $p->sale_price ? (float)$p->regular_price : null,
                'sale_price' => $p->sale_price ? (float)$p->sale_price : null,
                'category' => !empty($p->categories) ? $p->categories[0]->name : 'Geral',
                'categoryId' => !empty($p->categories) ? $p->categories[0]->id : null,
                'image' => !empty($p->images) ? $p->images[0]->src : '',
                'images' => array_map(function($img) { return $img->src; }, $p->images),
                'rating' => (float)$p->average_rating,
                'reviews' => $p->review_count,
                'sizes' => empty($sizes) ? ['P', 'M', 'G'] : $sizes,
                'colors' => empty($colors) ? ['Natural'] : $colors,
                'description' => strip_tags($p->description),
                'tag' => $p->on_sale ? 'Promoção' : null
            ];
        }
        echo json_encode($formatted);
    } else {
        http_response_code($res['code'] ?: 500);
        echo json_encode(["error" => "Erro ao conectar no WooCommerce"]);
    }
} elseif ($method === 'POST' || $method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $images = [];
    if (!empty($data['images']) && is_array($data['images'])) {
        foreach($data['images'] as $img) {
            if (!empty($img)) $images[] = ['src' => $img];
        }
    } elseif (!empty($data['image'])) {
        $images[] = ['src' => $data['image']];
    }

    $attributes = [];
    if (!empty($data['sizes']) && is_array($data['sizes'])) {
        $attributes[] = [
            'name' => 'Tamanho',
            'position' => 0,
            'visible' => true,
            'variation' => true,
            'options' => $data['sizes']
        ];
    }
    if (!empty($data['colors']) && is_array($data['colors'])) {
        $attributes[] = [
            'name' => 'Cor',
            'position' => 1,
            'visible' => true,
            'variation' => true,
            'options' => $data['colors']
        ];
    }

    $payload = [
        'name' => $data['name'],
        'regular_price' => (string)$data['price'],
        'description' => $data['description'],
        'images' => $images,
        'attributes' => $attributes
    ];

    if (!empty($data['sale_price'])) {
        $payload['sale_price'] = (string)$data['sale_price'];
    } else {
        $payload['sale_price'] = '';
    }

    if (!empty($data['categoryId'])) {
        $payload['categories'] = [['id' => (int)$data['categoryId']]];
    }

    $endpoint = $method === 'PUT' ? $url . '/' . $data['id'] : $url;
    $res = wc_curl($endpoint, $method, $payload);
    http_response_code($res['code']);
    echo $res['body'];
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if ($id) {
        $res = wc_curl($url . '/' . $id . '?force=true', 'DELETE');
        http_response_code($res['code']);
        echo $res['body'];
    } else {
        http_response_code(400);
        echo json_encode(["error" => "ID missing"]);
    }
}