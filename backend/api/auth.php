<?php
// C:\Users\henri\Desktop\vaqueiro-store\backend\api\auth.php

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data->action)) {
        if ($data->action === 'login') {
            $email = $data->email;
            $password = $data->password;

            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                unset($user['password']); // Don't return password
                echo json_encode(["status" => "success", "user" => $user]);
            } else {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Credenciais inválidas"]);
            }
        } elseif ($data->action === 'register') {
            $name = $data->name;
            $email = $data->email;
            $password = password_hash($data->password, PASSWORD_DEFAULT);

            try {
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
                $stmt->execute([$name, $email, $password]);
                echo json_encode(["status" => "success", "message" => "Usuário registrado com sucesso"]);
            } catch (PDOException $e) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "E-mail já cadastrado"]);
            }
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
