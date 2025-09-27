<?php
// Include the database configuration
require_once 'config.php';

// --- Helper function to display messages ---
function show_message($message, $type = 'info') {
    $color = 'blue';
    if ($type === 'success') $color = 'green';
    if ($type === 'error') $color = 'red';
    echo "<p style='color:$color;'>$message</p>";
}

// --- Database Connection ---
try {
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("USE " . DB_NAME);
} catch (PDOException $e) {
    die("<p style='color:red;'>Database connection failed: " . $e->getMessage() . ". Please ensure the database '" . DB_NAME . "' exists and the credentials in 'config.php' are correct.</p>");
}

// --- Admin User Creation Logic ---
$admin_user_exists = false;
try {
    $stmt = $pdo->query("SELECT 1 FROM `users` LIMIT 1");
    if ($stmt->fetchColumn()) {
        $admin_user_exists = true;
    }
} catch (PDOException $e) {
    // This likely means the table doesn't exist yet, which is fine.
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create_admin'])) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($username) || empty($email) || empty($password)) {
        show_message('All fields are required.', 'error');
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        show_message('Invalid email format.', 'error');
    } else {
        try {
            // Hash the password securely
            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO `users` (username, email, password) VALUES (:username, :email, :password)");
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':password' => $password_hash
            ]);

            show_message('Admin user created successfully!', 'success');
            echo "<p style='font-weight:bold; color:red;'>IMPORTANT: For security reasons, please delete this 'install.php' file immediately.</p>";
            exit(); // Stop further execution

        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 1062) { // Duplicate entry
                show_message('Username or email already exists.', 'error');
            } else {
                show_message('Database error: ' . $e->getMessage(), 'error');
            }
        }
    }
}

// --- Main Installation Flow ---
echo "<h1>Application Installer</h1>";

// Step 1: Table Creation
if (!$admin_user_exists) {
    echo "<h2>Step 1: Creating Database Tables</h2>";
    try {
        $sql = "
        CREATE TABLE IF NOT EXISTS `users` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `username` VARCHAR(50) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `email` VARCHAR(100) NOT NULL UNIQUE, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE IF NOT EXISTS `about` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `content` TEXT NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE IF NOT EXISTS `skills` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `name` VARCHAR(100) NOT NULL, `percentage` INT NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE IF NOT EXISTS `experience` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `job_title` VARCHAR(100) NOT NULL, `company` VARCHAR(100) NOT NULL, `start_date` DATE NOT NULL, `end_date` DATE, `description` TEXT NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE IF NOT EXISTS `education` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `degree` VARCHAR(100) NOT NULL, `institution` VARCHAR(100) NOT NULL, `start_date` DATE NOT NULL, `end_date` DATE, `description` TEXT NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE IF NOT EXISTS `projects` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `title` VARCHAR(100) NOT NULL, `description` TEXT NOT NULL, `link` VARCHAR(255), `image_url` VARCHAR(255) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        CREATE TABLE IF NOT EXISTS `status_checks` ( `id` VARCHAR(36) PRIMARY KEY, `client_name` VARCHAR(255) NOT NULL, `timestamp` DATETIME NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        $pdo->exec($sql);
        show_message('Tables created successfully (or already exist).', 'success');
    } catch (PDOException $e) {
        die("<p style='color:red;'>Table creation failed: " . $e->getMessage() . "</p>");
    }

    // Step 2: Create Admin User Form
    echo "<h2>Step 2: Create Admin User</h2>";
    echo '
    <form method="POST" action="install.php">
        <div>
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" required>
        </div>
        <br>
        <div>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required>
        </div>
        <br>
        <div>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required>
        </div>
        <br>
        <button type="submit" name="create_admin">Create Admin</button>
    </form>
    ';
} else {
    show_message('An admin user already exists or the tables are already set up.', 'info');
    echo "<p style='font-weight:bold; color:red;'>IMPORTANT: For security reasons, if setup is complete, please delete this 'install.php' file immediately.</p>";
}

?>