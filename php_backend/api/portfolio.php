<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin

require_once '../config.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$response = [];

try {
    // Fetch About content
    $response['about'] = $pdo->query("SELECT content FROM about LIMIT 1")->fetchColumn() ?: '';

    // Fetch Skills
    $response['skills'] = $pdo->query("SELECT name, percentage FROM skills ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);

    // Fetch Experience
    $response['experience'] = $pdo->query("SELECT job_title, company, start_date, end_date, description FROM experience ORDER BY start_date DESC")->fetchAll(PDO::FETCH_ASSOC);

    // Fetch Education
    $response['education'] = $pdo->query("SELECT degree, institution, start_date, end_date, description FROM education ORDER BY start_date DESC")->fetchAll(PDO::FETCH_ASSOC);

    // Fetch Projects
    $response['projects'] = $pdo->query("SELECT title, description, link, image_url FROM projects ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch portfolio data: ' . $e->getMessage()]);
}
?>