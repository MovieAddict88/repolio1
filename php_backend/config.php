<?php
// --- SECURITY WARNING ---
// It is strongly recommended to use environment variables for database credentials
// instead of hardcoding them directly in this file. This is a security risk.
//
// In a production environment, you should use a library like 'phpdotenv'
// and load variables from a .env file.
//
// Example:
// require 'vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();
// define('DB_HOST', $_ENV['DB_HOST']);
// define('DB_USERNAME', $_ENV['DB_USERNAME']);
// define('DB_PASSWORD', $_ENV['DB_PASSWORD']);
// define('DB_NAME', $_ENV['DB_NAME']);

// --- DATABASE CONFIGURATION (Hardcoded for this environment) ---
define('DB_HOST', 'sql202.infinityfree.com');
define('DB_USERNAME', 'if0_40036616');
define('DB_PASSWORD', '8JlQoxPDaaR7');
define('DB_NAME', 'if0_40036616_ronald');

// Set the default timezone
date_default_timezone_set('UTC');

// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>