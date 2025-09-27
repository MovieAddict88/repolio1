<?php
session_start();

// If user is not logged in, redirect to login page
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

$username = htmlspecialchars($_SESSION['username']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        body { font-family: sans-serif; margin: 0; background-color: #f4f4f4; }
        .header { background-color: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .header a { color: white; text-decoration: none; padding: 0.5rem 1rem; background-color: #007bff; border-radius: 4px; }
        .header a:hover { background-color: #0056b3; }
        .container { padding: 2rem; }
        .welcome { margin-bottom: 2rem; }
        .nav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .nav-item { background: white; padding: 1.5rem; text-align: center; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .nav-item a { text-decoration: none; color: #333; font-weight: bold; font-size: 1.1rem; }
        .nav-item:hover { transform: translateY(-5px); transition: transform 0.2s; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Admin Dashboard</h1>
        <a href="?logout=true">Logout</a>
    </div>

    <div class="container">
        <h2 class="welcome">Welcome, <?php echo $username; ?>!</h2>
        <p>Select a section to manage the website content.</p>

        <div class="nav-grid">
            <div class="nav-item"><a href="manage_about.php">Manage About Section</a></div>
            <div class="nav-item"><a href="manage_skills.php">Manage Skills</a></div>
            <div class="nav-item"><a href="manage_experience.php">Manage Experience</a></div>
            <div class="nav-item"><a href="manage_education.php">Manage Education</a></div>
            <div class="nav-item"><a href="manage_projects.php">Manage Projects</a></div>
        </div>
    </div>
</body>
</html>