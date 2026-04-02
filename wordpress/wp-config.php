<?php
// C:\Users\henri\Desktop\vaqueiro-store\wordpress\wp-config.php

define( 'DB_NAME', 'vaqueiro_wp_db' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', '461xIBZazRtM' ); // Senha master da VPS
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

$table_prefix = 'wp_';

define( 'WP_DEBUG', false );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
