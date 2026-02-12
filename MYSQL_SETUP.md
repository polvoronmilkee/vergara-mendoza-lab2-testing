# MySQL Database Setup Guide

This project has been updated to use MySQL instead of file-based storage for users and tasks. Follow these steps to complete the setup.

## Prerequisites

- Node.js (v12+) - already installed
- MySQL Server (v5.7+ or MySQL 8.0)

## Step 1: Install MySQL Server

### Windows

1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. **Important**: Remember the root password you set during installation
4. Keep default configurations

### macOS

```bash
brew install mysql@8.0
brew services start mysql@8.0
mysql -u root -p < /dev/stdin <<< "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

## Step 2: Create Database Schema

Run the schema file to create the database and tables:

```bash
mysql -u root -p < data-db/schema.sql
```

Enter your MySQL password when prompted.

**Or manually**:

```bash
mysql -u root -p
# Enter your password, then run:
```

Paste contents from `data-db/schema.sql`

## Step 3: Install npm Dependencies

```bash
npm install
```

This will install the `mysql2` package and other dependencies.

## Step 4: Configure Environment Variables (Optional)

Create a `.env` file in the project root if your MySQL credentials are different:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=todo_app
```

If not provided, the app will use default values:

- Host: `localhost`
- User: `root`
- Password: `password`
- Database: `todo_app`

## Step 5: Migrate Existing Data (If you have an old file-based database)

If you were using the file-based system before, migrate your data to MySQL:

```bash
node data-db/migration.js
```

This script will:

- Read all users from `data-db/users_txt.txt`
- Read all tasks from `data-db/users_tasks/`
- Insert them into the MySQL database

## Step 6: Start the Application

```bash
npm run dev
```

The app will start on `http://localhost:3000`

## Troubleshooting

### Connection Error: "ECONNREFUSED"

- Make sure MySQL is running
  - Windows: Check Services or MySQL Workbench
  - macOS: `brew services list` should show mysql as active
  - Linux: `sudo systemctl status mysql`

### Connection Error: "Access Denied"

- Verify your MySQL credentials in `.env`
- Default is: user=`root`, password=`password`
- If you set a different password during installation, update `.env`

### Database Not Found

- Run the schema setup again: `mysql -u root -p < data-db/schema.sql`

### Tables Already Exist

- This is fine. The schema uses `CREATE TABLE IF NOT EXISTS`

### Migration Errors

- Make sure `data-db/users_txt.txt` and `data-db/users_tasks/` exist
- Check that the files contain valid data before migration

## Database Schema

The MySQL database (`todo_app`) has these tables:

### `users` table

- `id` - Primary key
- `email` - User email (unique)
- `password_encrypted` - Encrypted password
- `iv` - Initialization vector for decryption
- `created_at` - Timestamp

### `tasks` table

- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Task name
- `time` - Created timestamp
- `task_id` - Unique task identifier
- `is_completed` - Boolean flag
- `created_at` / `updated_at` - Timestamps

### `completed_tasks` table

- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Task name
- `time` - Created timestamp
- `task_id` - Unique task identifier
- `created_at` - Timestamp

## Quick Start Checklist

- [ ] MySQL installed and running
- [ ] Schema created: `mysql -u root -p < data-db/schema.sql`
- [ ] Dependencies installed: `npm install`
- [ ] `.env` file configured (optional, uses defaults if omitted)
- [ ] Existing data migrated (optional): `node data-db/migration.js`
- [ ] Start app: `npm run dev`

## Next Steps

Once MySQL is set up:

1. Visit `http://localhost:3000`
2. Register a new account
3. Create and manage your tasks
4. All data is now stored in MySQL

---

For issues, check the console for detailed error messages.
