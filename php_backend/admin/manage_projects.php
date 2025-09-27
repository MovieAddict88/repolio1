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

// CREATE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_project'])) {
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $link = filter_var(trim($_POST['link']), FILTER_VALIDATE_URL) ? trim($_POST['link']) : null;
    $image_url = filter_var(trim($_POST['image_url']), FILTER_VALIDATE_URL) ? trim($_POST['image_url']) : null;

    if (!empty($title) && !empty($description)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO projects (title, description, link, image_url) VALUES (:title, :description, :link, :image_url)");
            $stmt->execute([':title' => $title, ':description' => $description, ':link' => $link, ':image_url' => $image_url]);
            $feedback = ['type' => 'success', 'message' => 'Project added successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        }
    } else {
        $feedback = ['type' => 'error', 'message' => 'Title and Description are required.'];
    }
}

// UPDATE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_project'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $link = filter_var(trim($_POST['link']), FILTER_VALIDATE_URL) ? trim($_POST['link']) : null;
    $image_url = filter_var(trim($_POST['image_url']), FILTER_VALIDATE_URL) ? trim($_POST['image_url']) : null;

    if ($id && !empty($title) && !empty($description)) {
        try {
            $stmt = $pdo->prepare("UPDATE projects SET title = :title, description = :description, link = :link, image_url = :image_url WHERE id = :id");
            $stmt->execute([':id' => $id, ':title' => $title, ':description' => $description, ':link' => $link, ':image_url' => $image_url]);
            $feedback = ['type' => 'success', 'message' => 'Project updated successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        }
    } else {
        $feedback = ['type' => 'error', 'message' => 'Invalid input for updating.'];
    }
}

// DELETE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_project'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM projects WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $feedback = ['type' => 'success', 'message' => 'Project deleted successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}

// READ: Fetch all projects
$projects = $pdo->query("SELECT * FROM projects ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);

$edit_data = null;
if (isset($_GET['edit'])) {
    $edit_id = filter_input(INPUT_GET, 'edit', FILTER_VALIDATE_INT);
    if ($edit_id) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->execute([':id' => $edit_id]);
        $edit_data = $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Projects</title>
    <style>
        body { font-family: sans-serif; margin: 0; background-color: #f4f4f4; }
        .header { background-color: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .header a { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid white; border-radius: 4px; }
        .header a:hover { background-color: white; color: #333; }
        .container { max-w-7xl; margin: 2rem auto; display: grid; grid-template-columns: 1fr 2.5fr; gap: 2rem; }
        .form-container, .list-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; }
        .form-group input, .form-group textarea { width: 100%; box-sizing: border-box; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
        textarea { min-height: 120px; }
        .message { padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .success { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
        button { padding: 0.75rem 1.5rem; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn-add { background-color: #28a745; } .btn-add:hover { background-color: #218838; }
        .btn-update { background-color: #007bff; } .btn-update:hover { background-color: #0056b3; }
        .btn-delete { background-color: #dc3545; padding: 0.3rem 0.6rem; font-size: 0.8rem; } .btn-delete:hover { background-color: #c82333; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; vertical-align: top; }
        th { background-color: #f8f9fa; }
        .actions { display: flex; gap: 0.5rem; }
        img.thumbnail { max-width: 100px; max-height: 60px; object-fit: cover; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Manage Projects</h1>
        <a href="index.php">Back to Dashboard</a>
    </div>

    <div class="container">
        <div class="form-container">
            <h2><?php echo $edit_data ? 'Edit Project' : 'Add New Project'; ?></h2>

            <?php if (!empty($feedback)): ?>
                <p class="message <?php echo $feedback['type']; ?>"><?php echo htmlspecialchars($feedback['message']); ?></p>
            <?php endif; ?>

            <form method="POST" action="manage_projects.php">
                <?php if ($edit_data): ?>
                    <input type="hidden" name="id" value="<?php echo $edit_data['id']; ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label for="title">Project Title</label>
                    <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($edit_data['title'] ?? ''); ?>" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" required><?php echo htmlspecialchars($edit_data['description'] ?? ''); ?></textarea>
                </div>
                <div class="form-group">
                    <label for="link">Project Link (URL)</label>
                    <input type="url" id="link" name="link" value="<?php echo htmlspecialchars($edit_data['link'] ?? ''); ?>">
                </div>
                <div class="form-group">
                    <label for="image_url">Image URL</label>
                    <input type="url" id="image_url" name="image_url" value="<?php echo htmlspecialchars($edit_data['image_url'] ?? ''); ?>">
                </div>

                <?php if ($edit_data): ?>
                    <button type="submit" name="edit_project" class="btn-update">Update Project</button>
                    <a href="manage_projects.php" style="margin-left: 1rem;">Cancel</a>
                <?php else: ?>
                    <button type="submit" name="add_project" class="btn-add">Add Project</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="list-container">
            <h2>Existing Projects</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($projects as $project): ?>
                    <tr>
                        <td>
                            <?php if ($project['image_url']): ?>
                                <img src="<?php echo htmlspecialchars($project['image_url']); ?>" alt="Project Image" class="thumbnail">
                            <?php endif; ?>
                        </td>
                        <td><?php echo htmlspecialchars($project['title']); ?></td>
                        <td>
                            <?php if ($project['link']): ?>
                                <a href="<?php echo htmlspecialchars($project['link']); ?>" target="_blank" rel="noopener noreferrer">View Project</a>
                            <?php endif; ?>
                        </td>
                        <td class="actions">
                            <a href="?edit=<?php echo $project['id']; ?>" style="text-decoration: none; padding: 0.3rem 0.6rem; background-color: #ffc107; color: black; border-radius: 4px;">Edit</a>
                            <form method="POST" action="manage_projects.php" style="display:inline;" onsubmit="return confirm('Are you sure?');">
                                <input type="hidden" name="id" value="<?php echo $project['id']; ?>">
                                <button type="submit" name="delete_project" class="btn-delete">Delete</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>