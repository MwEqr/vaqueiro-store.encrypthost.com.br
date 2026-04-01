<?php
// C:\Users\henri\Desktop\vaqueiro-store\wordpress\wp-config.php

define( 'DB_NAME', 'vaqueiro_wp_db' );
define( 'DB_USER', 'vaqueiro_user' );
define( 'DB_PASSWORD', '' ); // Assumindo senha vazia no localhost, se tiver senha me avise
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

$table_prefix = 'wp_';

define( 'WP_DEBUG', false );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
