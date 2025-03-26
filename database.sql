-- Création de la base de données
CREATE DATABASE IF NOT EXISTS cool_records;
USE cool_records;

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_utilisateur VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    url_image VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie_id INT,
    titre VARCHAR(100) NOT NULL,
    artiste VARCHAR(100) NOT NULL,
    annee_sortie INT,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    etat ENUM('neuf', 'excellent', 'tres_bon', 'bon', 'correct') NOT NULL,
    url_image VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

-- Table des commandes
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente', 'en_cours', 'expedie', 'livre', 'annule') NOT NULL DEFAULT 'en_attente',
    adresse_livraison TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des détails de commande
CREATE TABLE details_commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- Table des sessions utilisateurs
CREATE TABLE sessions_utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    token_session VARCHAR(255) NOT NULL,
    date_expiration TIMESTAMP NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des réinitialisations de mot de passe
CREATE TABLE reinitialisations_mot_de_passe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    date_expiration TIMESTAMP NOT NULL,
    utilise BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Insertion des catégories de base
INSERT INTO categories (nom, description) VALUES
('Rock Légendaire', 'Les plus grands classiques du rock'),
('Jazz Intemporel', 'Les chefs-d''œuvre du jazz'),
('Soul & Funk', 'Les perles de la soul et du funk'),
('Rap Légendaire', 'Les albums mythiques du rap'),
('Classique', 'Les plus belles œuvres classiques');

-- Insertion d'un utilisateur administrateur par défaut
INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe) VALUES
('admin', 'admincoolrecords@gmail.com', 'root14'); 