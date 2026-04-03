<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\repay.php
require_once __DIR__ . '/../config/db.php';

$order_id = $_GET['id'] ?? '';

if (empty($order_id)) {
    http_response_code(400);
    echo json_encode(["error" => "ID do pedido ausente"]);
    exit;
}

$url = WC_STORE_URL . '/wp-json/wc/v3/orders/' . $order_id;
$auth = base64_encode(WC_CONSUMER_KEY . ':' . WC_CONSUMER_SECRET);

// 1. Buscar detalhes do pedido no WooCommerce
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . $auth,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
    http_response_code($code);
    echo $res;
    exit;
}

$order = json_decode($res);

// 2. Verificar se o pedido já foi pago ou cancelado
if ($order->status !== 'pending' && $order->status !== 'failed') {
    echo json_encode(["error" => "Este pedido não pode ser pago no momento. Status: " . $order->status]);
    exit;
}

// 3. Buscar o Token do Mercado Pago no DB
$stmt = $pdo->prepare("SELECT option_value FROM wp_options WHERE option_name = '_mp_access_token_prod' LIMIT 1");
$stmt->execute();
$token_row = $stmt->fetch(PDO::FETCH_ASSOC);
$mp_access_token = $token_row ? $token_row['option_value'] : '';

if (empty($mp_access_token)) {
    echo json_encode(["error" => "Configuração do Mercado Pago não encontrada."]);
    exit;
}

// 4. Gerar nova Preference do Mercado Pago
$items_desc = [];
foreach ($order->line_items as $l_item) {
    $items_desc[] = $l_item->quantity . 'x ' . $l_item->name;
}
$desc = implode(', ', $items_desc);
if (strlen($desc) > 250) {
    $desc = substr($desc, 0, 247) . '...';
}

$mp_payload = [
    'items' => [
        [
            'title' => 'Pedido #' . $order->id,
            'description' => $desc,
            'quantity' => 1,
            'unit_price' => (float)$order->total,
            'currency_id' => 'BRL'
        ]
    ],
    'external_reference' => (string)$order->id,
    'notification_url' => WC_STORE_URL . '/?wc-api=WC_WooMercadoPago_Basic_Gateway&source_news=ipn',
    'back_urls' => [
        'success' => 'https://vaqueiro-store.encrypthost.com.br/sucesso?order=' . $order->id,
        'pending' => 'https://vaqueiro-store.encrypthost.com.br/pendente?order=' . $order->id,
        'failure' => 'https://vaqueiro-store.encrypthost.com.br/checkout'
    ],
    'auto_return' => 'approved'
];

$ch_mp = curl_init('https://api.mercadopago.com/checkout/preferences');
curl_setopt($ch_mp, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch_mp, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch_mp, CURLOPT_POSTFIELDS, json_encode($mp_payload));
curl_setopt($ch_mp, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $mp_access_token,
    'Content-Type: application/json'
]);
$mp_res = curl_exec($ch_mp);
$mp_code = curl_getinfo($ch_mp, CURLINFO_HTTP_CODE);
curl_close($ch_mp);

if ($mp_code === 201 || $mp_code === 200) {
    $mp_pref = json_decode($mp_res);
    echo json_encode([
        "status" => "success",
        "payment_url" => $mp_pref->init_point
    ]);
} else {
    http_response_code($mp_code);
    echo $mp_res;
}
