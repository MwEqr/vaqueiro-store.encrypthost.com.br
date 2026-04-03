<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\orders.php
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$url = WC_STORE_URL . '/wp-json/wc/v3/orders';
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
    // Se tiver um ID de cliente, busca apenas os dele, senão busca todos
    $customer_id = $_GET['customer'] ?? '';
    $endpoint = $url . '?per_page=100';
    if (!empty($customer_id)) {
        $endpoint .= '&customer=' . $customer_id;
    }

    $res = wc_curl($endpoint, 'GET');
    if ($res['code'] === 200) {
        $wc_orders = json_decode($res['body']);
        $formatted = [];
        foreach ($wc_orders as $o) {
            $formatted[] = [
                'id' => $o->id,
                'status' => $o->status,
                'total' => $o->total,
                'date_created' => $o->date_created,
                'customer_name' => $o->billing->first_name . ' ' . $o->billing->last_name,
                'customer_email' => $o->billing->email,
                'payment_method' => $o->payment_method_title,
                'order_key' => $o->order_key,
                'payment_url' => WC_STORE_URL . '/checkout/order-pay/' . $o->id . '/?pay_for_order=true&key=' . $o->order_key,
                'items' => array_map(function($i) {
                    return [
                        'name' => $i->name,
                        'quantity' => $i->quantity,
                        'total' => $i->total
                    ];
                }, $o->line_items)
            ];
        }
        echo json_encode($formatted);
    } else {
        http_response_code($res['code'] ?: 500);
        echo json_encode(["error" => "Falha ao buscar pedidos"]);
    }
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $status = $data['status'] ?? null;

    if ($id && $status) {
        // WooCommerce native statuses: pending, processing, on-hold, completed, cancelled, refunded, failed
        $payload = ['status' => $status];
        $res = wc_curl($url . '/' . $id, 'PUT', $payload);
        http_response_code($res['code']);
        echo $res['body'];
    } else {
        http_response_code(400);
        echo json_encode(["error" => "ID ou Status invalido"]);
    }
} else {
    http_response_code(405);
}
