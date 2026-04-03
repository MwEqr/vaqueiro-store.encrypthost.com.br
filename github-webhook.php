<?php
$secret = 'vaqueiro_deploy_2026'; // Secret key for validation

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Only POST requests allowed");
}

if (!isset($_GET['secret']) || $_GET['secret'] !== $secret) {
    http_response_code(403);
    die("Unauthorized");
}

// Ensure the directory is correct
$repo_dir = '/www/wwwroot/vaqueiro-store.encrypthost.com.br';
chdir($repo_dir);

$log_file = $repo_dir . '/webhook.log';

$output = "--- Deploy started at " . date('Y-m-d H:i:s') . " ---\n";

// Run git pull
$output .= "\n[GIT PULL]\n";
$output .= shell_exec("git pull origin main 2>&1");

// Run UI Build
$output .= "\n[NPM INSTALL]\n";
$output .= shell_exec("export PATH=\$PATH:/usr/local/bin:/usr/bin; cd frontend && npm install --include=dev 2>&1");

$output .= "\n[NPM BUILD]\n";
$output .= shell_exec("export PATH=\$PATH:/usr/local/bin:/usr/bin; cd frontend && npm run build 2>&1");

$output .= "\n--- Deploy finished at " . date('Y-m-d H:i:s') . " ---\n\n";

// Log the output
file_put_contents($log_file, $output, FILE_APPEND);

echo "Deployed successfully!";
?>
