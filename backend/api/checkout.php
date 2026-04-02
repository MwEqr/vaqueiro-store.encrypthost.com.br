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
    $order_id = $order->id;

    // Buscar o Token do Mercado Pago diretamente no banco de dados do WP
    $stmt = $pdo->prepare("SELECT option_value FROM wp_options WHERE option_name = '_mp_access_token_prod' LIMIT 1");
    $stmt->execute();
    $token_row = $stmt->fetch(PDO::FETCH_ASSOC);
    $mp_access_token = $token_row ? $token_row['option_value'] : '';

    $payment_url = WC_STORE_URL . '/checkout/order-pay/' . $order_id . '/?pay_for_order=true&key=' . $order->order_key;

    if (!empty($mp_access_token)) {
        // Preparar Preference para o Mercado Pago
        $mp_items = [];
        foreach ($data['items'] as $item) {
            $mp_items[] = [
                'title' => $item['name'] ?? 'Produto',
                'quantity' => (int)$item['quantity'],
                'unit_price' => (float)$item['price'],
                'currency_id' => 'BRL'
            ];
        }

        // Frete
        if (!empty($data['freight']) && $data['freight'] > 0) {
            $mp_items[] = [
                'title' => 'Frete (Correios)',
                'quantity' => 1,
                'unit_price' => (float)$data['freight'],
                'currency_id' => 'BRL'
            ];
        }

        $mp_payload = [
            'items' => $mp_items,
            'payer' => [
                'name' => $data['customer']['firstName'],
                'surname' => $data['customer']['lastName'],
                'email' => $data['customer']['email'],
                'phone' => [
                    'number' => $data['customer']['phone']
                ],
                'address' => [
                    'street_name' => $data['customer']['address'],
                    'zip_code' => $data['customer']['cep']
                ]
            ],
            'external_reference' => (string)$order_id,
            'notification_url' => WC_STORE_URL . '/?wc-api=WC_WooMercadoPago_Basic_Gateway&source_news=ipn',
            'back_urls' => [
                'success' => 'https://vaqueiro-store.encrypthost.com.br/sucesso?order=' . $order_id,
                'pending' => 'https://vaqueiro-store.encrypthost.com.br/pendente?order=' . $order_id,
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
            if (isset($mp_pref->init_point)) {
                $payment_url = $mp_pref->init_point; // URL direta para o Checkout Pro (bonitinho) do Mercado Pago
            }
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'order_id' => $order_id,
        'payment_url' => $payment_url
    ]);
} else {
    http_response_code($code);
    echo $res;
}