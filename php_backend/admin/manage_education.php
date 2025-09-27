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
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_education'])) {
    $degree = trim($_POST['degree']);
    $institution = trim($_POST['institution']);
    $start_date = trim($_POST['start_date']);
    $end_date = !empty($_POST['end_date']) ? trim($_POST['end_date']) : null;
    $description = trim($_POST['description']);

    if (!empty($degree) && !empty($institution) && !empty($start_date)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO education (degree, institution, start_date, end_date, description) VALUES (:degree, :institution, :start_date, :end_date, :description)");
            $stmt->execute([
                ':degree' => $degree,
                ':institution' => $institution,
                ':start_date' => $start_date,
                ':end_date' => $end_date,
                ':description' => $description
            ]);
            $feedback = ['type' => 'success', 'message' => 'Education entry added successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        }
    } else {
        $feedback = ['type' => 'error', 'message' => 'Degree, Institution, and Start Date are required.'];
    }
}

// UPDATE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_education'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $degree = trim($_POST['degree']);
    $institution = trim($_POST['institution']);
    $start_date = trim($_POST['start_date']);
    $end_date = !empty($_POST['end_date']) ? trim($_POST['end_date']) : null;
    $description = trim($_POST['description']);

    if ($id && !empty($degree) && !empty($institution) && !empty($start_date)) {
        try {
            $stmt = $pdo->prepare("UPDATE education SET degree = :degree, institution = :institution, start_date = :start_date, end_date = :end_date, description = :description WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':degree' => $degree,
                ':institution' => $institution,
                ':start_date' => $start_date,
                ':end_date' => $end_date,
                ':description' => $description
            ]);
            $feedback = ['type' => 'success', 'message' => 'Education entry updated successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        }
    } else {
        $feedback = ['type' => 'error', 'message' => 'Invalid input for updating.'];
    }
}

// DELETE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_education'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    if ($id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM education WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $feedback = ['type' => 'success', 'message' => 'Education entry deleted successfully.'];
        } catch (PDOException $e) {
            $feedback = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}

// READ: Fetch all education entries
$education_entries = $pdo->query("SELECT * FROM education ORDER BY start_date DESC")->fetchAll(PDO::FETCH_ASSOC);

$edit_data = null;
if (isset($_GET['edit'])) {
    $edit_id = filter_input(INPUT_GET, 'edit', FILTER_VALIDATE_INT);
    if ($edit_id) {
        $stmt = $pdo->prepare("SELECT * FROM education WHERE id = :id");
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
    <title>Manage Education</title>
    <link rel="stylesheet" href="admin_styles.css"> <!-- Shared stylesheet -->
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
        textarea { min-height: 100px; }
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
    </style>
</head>
<body>
    <div class="header">
        <h1>Manage Education</h1>
        <a href="index.php">Back to Dashboard</a>
    </div>

    <div class="container">
        <div class="form-container">
            <h2><?php echo $edit_data ? 'Edit Education' : 'Add New Education'; ?></h2>

            <?php if (!empty($feedback)): ?>
                <p class="message <?php echo $feedback['type']; ?>"><?php echo htmlspecialchars($feedback['message']); ?></p>
            <?php endif; ?>

            <form method="POST" action="manage_education.php">
                <?php if ($edit_data): ?>
                    <input type="hidden" name="id" value="<?php echo $edit_data['id']; ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label for="degree">Degree/Certificate</label>
                    <input type="text" id="degree" name="degree" value="<?php echo htmlspecialchars($edit_data['degree'] ?? ''); ?>" required>
                </div>
                <div class="form-group">
                    <label for="institution">Institution</label>
                    <input type="text" id="institution" name="institution" value="<?php echo htmlspecialchars($edit_data['institution'] ?? ''); ?>" required>
                </div>
                <div class="form-group">
                    <label for="start_date">Start Date</label>
                    <input type="date" id="start_date" name="start_date" value="<?php echo htmlspecialchars($edit_data['start_date'] ?? ''); ?>" required>
                </div>
                <div class="form-group">
                    <label for="end_date">End Date (leave blank if ongoing)</label>
                    <input type="date" id="end_date" name="end_date" value="<?php echo htmlspecialchars($edit_data['end_date'] ?? ''); ?>">
                </div>
                <div class="form-group">
                    <label for="description">Description (Optional)</label>
                    <textarea id="description" name="description"><?php echo htmlspecialchars($edit_data['description'] ?? ''); ?></textarea>
                </div>

                <?php if ($edit_data): ?>
                    <button type="submit" name="edit_education" class="btn-update">Update Entry</button>
                    <a href="manage_education.php" style="margin-left: 1rem;">Cancel</a>
                <?php else: ?>
                    <button type="submit" name="add_education" class="btn-add">Add Entry</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="list-container">
            <h2>Existing Education Entries</h2>
            <table>
                <thead>
                    <tr>
                        <th>Degree</th>
                        <th>Institution</th>
                        <th>Dates</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($education_entries as $entry): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($entry['degree']); ?></td>
                        <td><?php echo htmlspecialchars($entry['institution']); ?></td>
                        <td><?php echo date('M Y', strtotime($entry['start_date'])); ?> - <?php echo $entry['end_date'] ? date('M Y', strtotime($entry['end_date'])) : 'Present'; ?></td>
                        <td class="actions">
                            <a href="?edit=<?php echo $entry['id']; ?>" style="text-decoration: none; padding: 0.3rem 0.6rem; background-color: #ffc107; color: black; border-radius: 4px;">Edit</a>
                            <form method="POST" action="manage_education.php" style="display:inline;" onsubmit="return confirm('Are you sure?');">
                                <input type="hidden" name="id" value="<?php echo $entry['id']; ?>">
                                <button type="submit" name="delete_education" class="btn-delete">Delete</button>
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