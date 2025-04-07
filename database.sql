-- Création de la base de données
CREATE DATABASE cool_records;
USE cool_records;

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    nom_utilisateur VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE categories (
    categorie_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    url_image VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE produits (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    categorie_id INT,
    titre VARCHAR(100) NOT NULL,
    artiste VARCHAR(100) NOT NULL,
    annee_sortie INT,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    url_image VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories(categorie_id)
);

-- Table des commandes
CREATE TABLE commandes (
    id_cmd INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente', 'en_cours', 'expedie', 'livre', 'annule') NOT NULL DEFAULT 'en_attente',
    adresse_livraison TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des détails de commande
CREATE TABLE details_commande (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_cmd INT NOT NULL,
    id_produit INT NOT NULL,
    quantite INT NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cmd) REFERENCES commandes(id_cmd),
    FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
);

-- Table des sessions utilisateurs
CREATE TABLE sessions_utilisateurs (
    id_session INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    token_session VARCHAR(255) NOT NULL,
    date_expiration TIMESTAMP NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des réinitialisations de mot de passe
CREATE TABLE reinitialisations_mot_de_passe (
    id_mdp INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    date_expiration TIMESTAMP NOT NULL,
    utilise BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(utilisateur_id) REFERENCES utilisateurs(id)
);

-- Insertion des catégories de base
INSERT INTO categories (nom, description) VALUES
('Rock Légendaire', 'Les plus grands classiques du rock'),
('Jazz Intemporel', 'Les chefs-d\'œuvre du jazz'),
('Soul & Funk', 'Les perles de la soul et du funk'),
('Rap Légendaire', 'Les albums mythiques du rap'),
('Classique', 'Les plus belles œuvres classiques');


