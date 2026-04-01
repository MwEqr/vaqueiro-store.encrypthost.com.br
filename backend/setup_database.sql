-- C:\Users\henri\Desktop\vaqueiro-store\backend\setup_database.sql

CREATE DATABASE IF NOT EXISTS vaqueiro_store;
USE vaqueiro_store;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    oldPrice DECIMAL(10, 2),
    category VARCHAR(100),
    image TEXT,
    images JSON,
    rating DECIMAL(2, 1),
    reviews INT,
    sizes JSON,
    colors JSON,
    description TEXT,
    details JSON,
    tag VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Initial Products
INSERT INTO products (name, price, oldPrice, category, image, images, rating, reviews, sizes, colors, description, details, tag) VALUES
('Bota de Couro Legítimo Pantaneira', 489.00, 599.00, 'Botas', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2000&auto=format&fit=crop"]', 4.9, 156, '["38", "39", "40", "41", "42", "43"]', '["Pinhão", "Preto", "Café"]', 'Bota confeccionada em couro bovino de alta qualidade, solado de borracha antiderrapante e forro interno macio. Ideal para o trabalho pesado ou para o passeio no final de semana.', '{"material": "100% Couro Bovino", "forro": "Couro de Carneiro", "cuidados": "Limpar com pano úmido e hidratar o couro periodicamente", "origem": "Nacional"}', 'Mais Vendida'),

('Chapéu de Feltro Premium Pralana', 329.90, 389.90, 'Chapéus', 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=2000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=2000&auto=format&fit=crop"]', 5.0, 92, '["56", "58", "60"]', '["Bege", "Preto", "Marrom"]', 'Chapéu clássico de feltro com aba larga e acabamento impecável. Resistente à água e com design que nunca sai de moda no mundo sertanejo.', '{"material": "Feltro 100% Lã", "forro": "Cetim", "cuidados": "Escovar com cerdas macias após o uso", "origem": "Nacional"}', 'Promoção'),

('Cinto de Couro com Fivela de Bronze', 159.90, 199.90, 'Acessórios', 'https://images.unsplash.com/photo-1614165933394-aa6056502213?q=80&w=2000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1614165933394-aa6056502213?q=80&w=2000&auto=format&fit=crop"]', 4.8, 45, '["85cm", "95cm", "105cm", "115cm"]', '["Whisky", "Preto"]', 'Cinto robusto em couro de sola com fivela intercambiável de bronze envelhecido. Detalhes entalhados à mão que conferem exclusividade à peça.', '{"material": "Couro de Sola", "forro": "N/A", "cuidados": "Não molhar a fivela excessivamente", "origem": "Artesanal"}', 'Exclusivo'),

('Calça Jeans Rústica Masculina', 189.90, NULL, 'Vestuário', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop"]', 4.7, 210, '["38", "40", "42", "44", "46", "48"]', '["Azul Indigo", "Stone Wash"]', 'Calça jeans reforçada com costura tripla e corte reto. Desenvolvida para suportar a rotina do campo sem abrir mão do estilo.', '{"material": "98% Algodão, 2% Elastano", "forro": "N/A", "cuidados": "Lavar do avesso para preservar a cor", "origem": "Nacional"}', NULL);

-- Users Table for Auth
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@vaqueirostore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
