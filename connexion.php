<?php
// Démarrer la session de manière sécurisée
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once 'config.php';

// Empêcher la mise en cache
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Activer les erreurs pour le développement
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Vérifier si c'est une requête POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom_utilisateur = $_POST['nom_utilisateur'] ?? '';
    $mot_de_passe = $_POST['mot_de_passe'] ?? '';

    // Vérifier si les champs requis sont présents
    if (empty($nom_utilisateur) || empty($mot_de_passe)) {
        $_SESSION['error'] = "Nom d'utilisateur et mot de passe requis";
header('Location: connexion.html');
        exit;
    }

    try {
        $sql = "SELECT * FROM utilisateurs WHERE nom_utilisateur = :nom_utilisateur";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['nom_utilisateur' => $nom_utilisateur]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($mot_de_passe, $user['mot_de_passe'])) {
            // Connexion réussie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['nom_utilisateur'] = $user['nom_utilisateur'];
            $_SESSION['nom'] = $user['nom'];
            $_SESSION['prenom'] = $user['prenom'];
            
           
                // Redirection vers la page d'accueil pour les requêtes normales
                header('Location: accueil.html');
                exit;
            }
             else {
            // Identifiants incorrects
            $_SESSION['error'] = "Identifiants incorrects";
header('Location: connexion.html');
            exit;
        }
    } catch (PDOException $e) {
$_SESSION['error'] = "Erreur de connexion à la base de données";
header('Location: connexion.html');
        exit;
    }
} else {
    http_response_code(405);
    echo "Méthode non autorisée";
}
?>