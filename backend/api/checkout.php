<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\checkout.php
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método não permitido"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$url = WC_STORE_URL . '/wp-json/wc/v3/orders';
$auth = base64_encode(WC_CONSUMER_KEY . ':' . WC_CONSUMER_SECRET);

// Prepara os itens do pedido
$line_items = [];
foreach ($data['items'] as $item) {
    $line_items[] = [
        'product_id' => $item['id'],
        'quantity' => $item['quantity'],
        'total' => (string)($item['price'] * $item['quantity']) // Força o preço do React para evitar R$ 0.00 no WooCommerce
    ];
}

// Prepara o frete
$shipping_lines = [
    [
        'method_id' => 'flat_rate',
        'method_title' => 'Entrega Padrão (Correios)',
        'total' => (string)$data['freight']
    ]
];

// Prepara o cupom (se houver)
$coupon_lines = [];
if (!empty($data['coupon'])) {
    $coupon_lines[] = ['code' => $data['coupon']];
}

// Corpo do Pedido para o WooCommerce
$payload = [
    'payment_method' => 'mercadopago', // Tenta forçar o mercado pago
    'payment_method_title' => 'Mercado Pago',
    'set_paid' => false,
    'billing' => [
        'first_name' => $data['customer']['firstName'],
        'last_name' => $data['customer']['lastName'],
        'address_1' => $data['customer']['address'],
        'address_2' => $data['customer']['complement'],
        'city' => $data['customer']['city'],
        'state' => $data['customer']['state'],
        'postcode' => $data['customer']['cep'],
        'country' => 'BR',
        'email' => $data['customer']['email'],
        'phone' => $data['customer']['phone']
    ],
    'shipping' => [
        'first_name' => $data['customer']['firstName'],
        'last_name' => $data['customer']['lastName'],
        'address_1' => $data['customer']['address'],
        'address_2' => $data['customer']['complement'],
        'city' => $data['customer']['city'],
        'state' => $data['customer']['state'],
        'postcode' => $data['customer']['cep'],
        'country' => 'BR'
    ],
    'line_items' => $line_items,
    'shipping_lines' => $shipping_lines,
    'coupon_lines' => $coupon_lines
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . $auth,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code === 201 || $code === 200) {
    $order = json_decode($res);
    
    // Pega a URL nativa de pagamento do WooCommerce do pedido criado
    $payment_url = WC_STORE_URL . '/checkout/order-pay/' . $order->id . '/?pay_for_order=true&key=' . $order->order_key;
    
    echo json_encode([
        'status' => 'success',
        'order_id' => $order->id,
        'payment_url' => $payment_url
    ]);
} else {
    http_response_code($code);
    echo $res;
}