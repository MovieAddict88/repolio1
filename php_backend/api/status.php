<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config.php';

// --- Database Connection ---
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle pre-flight OPTIONS request for CORS
if ($method === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// --- GET Request: Fetch all status checks ---
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, client_name, timestamp FROM status_checks ORDER BY timestamp DESC");
        $status_checks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($status_checks);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch status checks: ' . $e->getMessage()]);
    }
}

// --- POST Request: Create a new status check ---
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['client_name'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'client_name is required.']);
        exit;
    }

    $client_name = trim($input['client_name']);

    // Generate a UUID (version 4)
    $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $timestamp = date('Y-m-d H:i:s');

    $new_status = [
        'id' => $id,
        'client_name' => $client_name,
        'timestamp' => $timestamp
    ];

    try {
        $stmt = $pdo->prepare("INSERT INTO status_checks (id, client_name, timestamp) VALUES (:id, :client_name, :timestamp)");
        $stmt->execute($new_status);

        http_response_code(201); // Created
        echo json_encode($new_status);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create status check: ' . $e->getMessage()]);
    }
}

// --- Handle other methods ---
else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed.']);
}
?>