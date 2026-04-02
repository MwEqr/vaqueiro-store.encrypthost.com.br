<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\categories.php
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$url = WC_STORE_URL . '/wp-json/wc/v3/products/categories';
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
        $wc_categories = json_decode($res['body']);
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
        http_response_code($res['code'] ?: 500);
        echo json_encode(["error" => "Falha ao buscar categorias"]);
    }
} elseif ($method === 'POST' || $method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $payload = ['name' => $data['name']];
    
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
