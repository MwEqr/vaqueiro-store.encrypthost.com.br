<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\auth.php

// Conecta diretamente ao núcleo do WordPress para usar as funções nativas de usuário
define('WP_USE_THEMES', false);
require_once __DIR__ . '/../../wordpress/wp-load.php';

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data->action)) {
        if ($data->action === 'login') {
            $email = sanitize_email($data->email);
            $password = $data->password;

            // Tenta autenticar usando a função nativa do WordPress
            $user = wp_authenticate($email, $password);

            if (is_wp_error($user)) {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "E-mail ou senha incorretos."]);
            } else {
                // Login bem-sucedido
                echo json_encode([
                    "status" => "success", 
                    "user" => [
                        "id" => $user->ID,
                        "name" => $user->display_name,
                        "firstName" => get_user_meta($user->ID, 'first_name', true) ?: $user->display_name,
                        "lastName" => get_user_meta($user->ID, 'last_name', true) ?: '',
                        "email" => $user->user_email
                    ]
                ]);
            }
        } elseif ($data->action === 'register') {
            $firstName = sanitize_text_field($data->firstName);
            $lastName = sanitize_text_field($data->lastName);
            $email = sanitize_email($data->email);
            $password = $data->password;

            if (email_exists($email)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Este e-mail já está cadastrado."]);
            } else {
                // Cria o usuário como "Customer" (Cliente da Loja) no WordPress
                $user_id = wp_create_user($email, $password, $email);
                
                if (is_wp_error($user_id)) {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => $user_id->get_error_message()]);
                } else {
                    // Atualiza o nome e define a função como customer
                    $user = new WP_User($user_id);
                    $user->set_role('customer');
                    
                    wp_update_user([
                        'ID' => $user_id,
                        'display_name' => $firstName . ' ' . $lastName,
                        'first_name' => $firstName,
                        'last_name' => $lastName
                    ]);

                    echo json_encode(["status" => "success", "message" => "Conta criada com sucesso!"]);
                }
            }
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido"]);
}
