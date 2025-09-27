<?php
session_start();
require_once '../config.php';

// If user is not logged in, redirect to login page
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Database connection
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$success_message = '';
$error_message = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = trim($_POST['content']);

    try {
        // Check if content already exists
        $stmt = $pdo->query("SELECT id FROM about LIMIT 1");
        $about_entry = $stmt->fetch();

        if ($about_entry) {
            // Update existing content
            $update_stmt = $pdo->prepare("UPDATE about SET content = :content WHERE id = :id");
            $update_stmt->execute([':content' => $content, ':id' => $about_entry['id']]);
        } else {
            // Insert new content
            $insert_stmt = $pdo->prepare("INSERT INTO about (content) VALUES (:content)");
            $insert_stmt->execute([':content' => $content]);
        }
        $success_message = 'About section updated successfully!';
    } catch (PDOException $e) {
        $error_message = 'Database error: ' . $e->getMessage();
    }
}

// Fetch current content
try {
    $stmt = $pdo->query("SELECT content FROM about LIMIT 1");
    $current_content = $stmt->fetchColumn();
} catch (PDOException $e) {
    $error_message = 'Could not fetch content: ' . $e->getMessage();
    $current_content = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage About Section</title>
    <style>
        body { font-family: sans-serif; margin: 0; background-color: #f4f4f4; }
        .header { background-color: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .header a { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid white; border-radius: 4px; }
        .header a:hover { background-color: white; color: #333; }
        .container { max-w-4xl; margin: 2rem auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        textarea { width: 100%; min-height: 250px; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
        .message { padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .success { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
        button { padding: 0.75rem 1.5rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
        button:hover { background-color: #0056b3; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Manage About Section</h1>
        <a href="index.php">Back to Dashboard</a>
    </div>

    <div class="container">
        <?php if ($success_message): ?>
            <p class="message success"><?php echo htmlspecialchars($success_message); ?></p>
        <?php endif; ?>
        <?php if ($error_message): ?>
            <p class="message error"><?php echo htmlspecialchars($error_message); ?></p>
        <?php endif; ?>

        <form method="POST" action="manage_about.php">
            <div class="form-group">
                <label for="content"><h3>About Content</h3></label>
                <textarea id="content" name="content" required><?php echo htmlspecialchars($current_content); ?></textarea>
            </div>
            <br>
            <button type="submit">Save Content</button>
        </form>
    </div>
</body>
</html>