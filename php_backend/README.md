# PHP Backend for Dynamic Portfolio

This directory contains the full PHP backend for the portfolio application. It includes a dynamic API, a full admin panel for content management, and an installation script.

## Requirements
- PHP (version 8.0 or higher recommended)
- MySQL Database
- Composer (for managing PHP dependencies)

## Setup and Installation

### 1. Database Configuration (Critical Security Step)

This application requires a connection to a MySQL database. For security reasons, you should **never** hardcode your database credentials directly in the code. Instead, use environment variables.

**Recommended Method (using `phpdotenv`):**

1.  **Install Composer:** If you don't have Composer, download it from [getcomposer.org](https://getcomposer.org).

2.  **Install Dependencies:** From within this `php_backend` directory, run the following command to install the necessary libraries:
    ```bash
    composer install
    ```

3.  **Create a `.env` file:** In this `php_backend` directory, create a file named `.env`. Copy the contents of `.env.example` into it and fill in your actual database credentials.

    ```dotenv
    # .env file
    DB_HOST="your_database_host"
    DB_USERNAME="your_username"
    DB_PASSWORD="your_password"
    DB_NAME="your_database_name"
    ```

4.  **Update `config.php`:** Uncomment the lines in `php_backend/config.php` that use `phpdotenv` to load credentials from your `.env` file, and remove the hardcoded credentials.

### 2. Run the Auto-Installer

Once your database is configured, navigate to the installer script in your browser. This will create all the necessary tables and guide you through creating the first admin user.

-   **URL:** `http://your-site.com/php_backend/install.php`

**IMPORTANT:** After the installation is complete, you **MUST** delete the `install.php` file from your server for security reasons.

### 3. Access the Admin Panel

With the installation complete, you can now log in to the admin panel to manage your portfolio content.

-   **URL:** `http://your-site.com/php_backend/admin/login.php`

## API Endpoints

The backend provides the following public API endpoints for the frontend:

-   `/api/portfolio.php` (GET): Fetches all public portfolio data (About, Skills, Experience, Education, Projects).
-   `/api/status.php` (GET, POST): Retrieves or creates status checks, replicating the original application's functionality.