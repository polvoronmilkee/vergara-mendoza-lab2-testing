# Project Setup (First Run)

This project uses MySQL for users and tasks. Follow these steps to run it locally and access the database.

## 1) Install MySQL
- Windows: https://dev.mysql.com/downloads/mysql/
- I personally followed this video as my guide: https://www.youtube.com/watch?v=wgRwITQHszU&t=305s
- Use the installer and remember the root password.
- Make sure the MySQL service is running.

## 2) Create the Database Schema
Option A: MySQL Workbench
1. Open Workbench and connect to your local MySQL server.
2. Open the schema file: data-db/schema.sql
3. Run the script (lightning bolt icon).

Option B: Command line
```
mysql -u root -p < data-db/schema.sql
```

## 3) Configure Environment Variables
Create a .env file in the project root using the example file:

```
copy .env.example .env
```

Update .env with your MySQL credentials.

## 4) Install Dependencies
```
npm install
```

## 5) (Optional) Migrate Old File Data
If you have existing file-based data, run:
```
node data-db/migration.js
```

## 6) Start the App
```
npm run dev
```

The app runs at http://localhost:3000

## Access the Database
- MySQL Workbench: connect and inspect tables under the todo_app schema.
- CLI:
```
mysql -u root -p
USE todo_app;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM tasks;
SELECT * FROM completed_tasks;
```

## Troubleshooting
- Access denied: check DB_USER/DB_PASSWORD in .env
- Service not running: start the MySQL service in Windows Services.
