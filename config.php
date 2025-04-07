<?php
$host = 'localhost';
$dbname = 'cool_records';
$username = 'root';
$password = '';
$port = '3307';

try {
    $connexion = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>