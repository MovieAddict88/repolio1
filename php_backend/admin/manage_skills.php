<?php
session_start();
require_once '../config.php';

// --- Authentication and Database Connection ---
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$feedback = [];

// --- C.R.U.D. Logic ---

// CREATE: Add a new skill
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_skill'])) {
    $name = trim($_POST['name']);
    $percentage = filter_input(INPUT_POST, 'percentage', FILTER_VALIDATE_INT, ["options" => ["min_range" => 0, "max_range" => 100]]);
    if (!empty($name) && $percentage !== false) {
        try {
            $stmt = $pdo->prepare("INSERT INTO skills (name, percentage) VALUES (:name, :percentage)");
            $stmt->execute([':name' => $name, ':percentage' => $percentage]);
            $feedback = ['type' => 'success', 'message' => 'Skill added successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error adding skill: ' . $e->getMessage()];
        }
    } else {
        $feedback = ['type' => 'error', 'message' => 'Invalid input. Please provide a name and a percentage (0-100).'];
    }
}

// UPDATE: Edit an existing skill
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_skill'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $name = trim($_POST['name']);
    $percentage = filter_input(INPUT_POST, 'percentage', FILTER_VALIDATE_INT, ["options" => ["min_range" => 0, "max_range" => 100]]);
    if ($id && !empty($name) && $percentage !== false) {
        try {
            $stmt = $pdo->prepare("UPDATE skills SET name = :name, percentage = :percentage WHERE id = :id");
            $stmt->execute([':id' => $id, ':name' => $name, ':percentage' => $percentage]);
            $feedback = ['type' => 'success', 'message' => 'Skill updated successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error updating skill: ' . $e->getMessage()];
        }
    } else {
        $feedback = ['type' => 'error', 'message' => 'Invalid input for updating skill.'];
    }
}

// DELETE: Remove a skill
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_skill'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM skills WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $feedback = ['type' => 'success', 'message' => 'Skill deleted successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error deleting skill: ' . $e->getMessage()];
        }
    }
}

// READ: Fetch all skills
$skills = $pdo->query("SELECT * FROM skills ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);

$edit_skill_data = null;
if (isset($_GET['edit'])) {
    $edit_id = filter_input(INPUT_GET, 'edit', FILTER_VALIDATE_INT);
    if ($edit_id) {
        $stmt = $pdo->prepare("SELECT * FROM skills WHERE id = :id");
        $stmt->execute([':id' => $edit_id]);
        $edit_skill_data = $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Skills</title>
    <link rel="stylesheet" href="admin_styles.css"> <!-- Assuming a shared stylesheet -->
    <style>
        body { font-family: sans-serif; margin: 0; background-color: #f4f4f4; }
        .header { background-color: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .header a { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid white; border-radius: 4px; }
        .header a:hover { background-color: white; color: #333; }
        .container { max-w-6xl; margin: 2rem auto; display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
        .form-container, .list-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; }
        .form-group input { width: 100%; box-sizing: border-box; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
        .message { padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .success { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
        button { padding: 0.75rem 1.5rem; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn-add { background-color: #28a745; } .btn-add:hover { background-color: #218838; }
        .btn-update { background-color: #007bff; } .btn-update:hover { background-color: #0056b3; }
        .btn-delete { background-color: #dc3545; padding: 0.3rem 0.6rem; font-size: 0.8rem; } .btn-delete:hover { background-color: #c82333; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
        .actions { display: flex; gap: 0.5rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Manage Skills</h1>
        <a href="index.php">Back to Dashboard</a>
    </div>

    <div class="container">
        <div class="form-container">
            <h2><?php echo $edit_skill_data ? 'Edit Skill' : 'Add New Skill'; ?></h2>

            <?php if (!empty($feedback)): ?>
                <p class="message <?php echo $feedback['type']; ?>"><?php echo htmlspecialchars($feedback['message']); ?></p>
            <?php endif; ?>

            <form method="POST" action="manage_skills.php">
                <?php if ($edit_skill_data): ?>
                    <input type="hidden" name="id" value="<?php echo $edit_skill_data['id']; ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label for="name">Skill Name</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($edit_skill_data['name'] ?? ''); ?>" required>
                </div>
                <div class="form-group">
                    <label for="percentage">Proficiency Percentage (0-100)</label>
                    <input type="number" id="percentage" name="percentage" min="0" max="100" value="<?php echo htmlspecialchars($edit_skill_data['percentage'] ?? ''); ?>" required>
                </div>

                <?php if ($edit_skill_data): ?>
                    <button type="submit" name="edit_skill" class="btn-update">Update Skill</button>
                    <a href="manage_skills.php" style="margin-left: 1rem; text-decoration: none;">Cancel Edit</a>
                <?php else: ?>
                    <button type="submit" name="add_skill" class="btn-add">Add Skill</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="list-container">
            <h2>Existing Skills</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Percentage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($skills)): ?>
                        <tr><td colspan="3">No skills added yet.</td></tr>
                    <?php else: ?>
                        <?php foreach ($skills as $skill): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($skill['name']); ?></td>
                            <td><?php echo htmlspecialchars($skill['percentage']); ?>%</td>
                            <td class="actions">
                                <a href="?edit=<?php echo $skill['id']; ?>" style="text-decoration: none; padding: 0.3rem 0.6rem; background-color: #ffc107; color: black; border-radius: 4px;">Edit</a>
                                <form method="POST" action="manage_skills.php" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this skill?');">
                                    <input type="hidden" name="id" value="<?php echo $skill['id']; ?>">
                                    <button type="submit" name="delete_skill" class="btn-delete">Delete</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>