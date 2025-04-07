<?php
session_start();
require_once 'config.php';
$message = '';
$errors = [];

// Pour assurer que la réponse est toujours en JSON
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $errors = [];
    
    // Vérification des champs obligatoires
    if (empty($_POST['nom'])) {
        $errors[] = "Le nom est obligatoire.";
    }
    
    if (empty($_POST['prenom'])) {
        $errors[] = "Le prénom est obligatoire.";
    }
    
    // Utilisation des noms de champs PHP originaux
    if (empty($_POST['nom_utilisateur'])) {
        $errors[] = "Le nom d'utilisateur est obligatoire.";
    }
    
    if (empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'adresse email n'est pas valide.";
    }
    
    // Utilisation des noms de champs PHP originaux
    if (empty($_POST['mot_de_passe']) || strlen($_POST['mot_de_passe']) < 8) {
        $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    
    // Utilisation du nom de champ PHP original pour mot_de_passe
    if ($_POST['mot_de_passe'] !== $_POST['confirm-password']) {
        $errors[] = "Les mots de passe ne correspondent pas.";
    }
    
    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    if (empty($errors)) {
        $checkEmail = $connexion->prepare("SELECT id FROM utilisateurs WHERE email = :email");
        $checkEmail->execute([':email' => $_POST['email']]);
        
        if ($checkEmail->rowCount() > 0) {
            $errors[] = "Cet email est déjà utilisé.";
        }
        
        $checkUsername = $connexion->prepare("SELECT id FROM utilisateurs WHERE nom_utilisateur = :nom_utilisateur");
        // Utilisation du nom de champ PHP original
        $checkUsername->execute([':nom_utilisateur' => $_POST['nom_utilisateur']]);
        
        if ($checkUsername->rowCount() > 0) {
            $errors[] = "Ce nom d'utilisateur est déjà utilisé.";
        }
    }
   
    // Si aucune erreur n'a été détectée, on procède à l'insertion
    if (empty($errors)) {
        // Hasher le mot de passe
        $motDePasseHash = password_hash($_POST['mot_de_passe'], PASSWORD_DEFAULT);
        
        $requete = $connexion->prepare("INSERT INTO utilisateurs 
            (nom, prenom, nom_utilisateur, email, mot_de_passe, date_creation)
            VALUES
            (:nom, :prenom, :nom_utilisateur, :email, :mot_de_passe, :date_creation)");
        
        try {
            $requete->execute([
                ':nom' => htmlspecialchars($_POST['nom']),
                ':prenom' => htmlspecialchars($_POST['prenom']),
                ':nom_utilisateur' => htmlspecialchars($_POST['nom_utilisateur']),
                ':email' => $_POST['email'],
                ':mot_de_passe' => $motDePasseHash,
                ':date_creation' => date('Y-m-d H:i:s')
            ]);
            
            // Inscription réussie - Rediriger vers la page de connexion
            $_SESSION['message'] = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
            header('Location: connexion.html');
            exit;
            
        } catch(PDOException $e) {
            if ($e->getCode() == '23000') {
                $errors[] = "Une erreur est survenue. Cet email ou ce nom d'utilisateur est peut-être déjà utilisé.";
            } else {
                $errors[] = "Erreur lors de l'enregistrement : " . $e->getMessage();
            }
        }
    }
    
    // S'il y a des erreurs, rediriger vers la page d'inscription
    if (!empty($errors)) {
        $_SESSION['errors'] = $errors;
        header('Location: inscription.html');
        exit;
    }
} else {
    // Si la méthode n'est pas POST
    header('Location: inscription.html');
    exit;
}
?>