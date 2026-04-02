<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\upload.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../../wordpress/wp-content/uploads/admin_uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['file']['name']));
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
            $url = 'https://vaqueiro-store.encrypthost.com.br/wordpress/wp-content/uploads/admin_uploads/' . $fileName;
            echo json_encode(['url' => $url]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Falha ao mover arquivo. Verifique permissões da pasta.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Nenhum arquivo recebido ou formato inválido']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo nao permitido']);
}
