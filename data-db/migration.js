/**
 * Migration script to move data from file-based storage to MySQL
 * Run this once to migrate existing file-based data to the database
 * Usage: node data-db/migration.js
 */

const fs = require("fs");
const path = require("path");
const db = require(path.join(__dirname, "../helpers/db"));
const crypto = require(path.join(__dirname, "../helpers/crypto"));
const { createUser } = require(path.join(__dirname, "../helpers/dbQueries"));

async function migrateUsersFile() {
  console.log("Starting user migration...");

  try {
    const usersFile = path.join(__dirname, "./users_txt.txt");
    if (!fs.existsSync(usersFile)) {
      console.log("No users file found. Skipping user migration.");
      return;
    }

    const data = fs.readFileSync(usersFile, "utf-8");
    const lines = data.split("\r\n").filter((line) => line.trim() !== "");

    let migratedCount = 0;

    for (const line of lines) {
      try {
        const decrypted = crypto.decrypt(line);
        if (!decrypted || typeof decrypted !== "string") {
          console.log("Skipping invalid encrypted line");
          continue;
        }

        const [email, password] = decrypted.split(":");
        if (!email || !password) {
          console.log("Skipping line with invalid format");
          continue;
        }

        try {
          await createUser(email, password);
          migratedCount++;
          console.log(`Migrated user: ${email}`);
        } catch (err) {
          if (err.message && err.message.includes("Duplicate entry")) {
            console.log(`User ${email} already exists in database. Skipping.`);
          } else {
            console.error(`Error creating user ${email}:`, err.message);
          }
        }
      } catch (err) {
        console.error("Error processing line:", err.message);
      }
    }

    console.log(`✓ Migrated ${migratedCount} users to database`);
  } catch (err) {
    console.error("Error migrating users:", err);
  }
}

async function migrateTasksFiles() {
  console.log("Starting tasks migration...");

  try {
    const tasksDir = path.join(__dirname, "./users_tasks");
    if (!fs.existsSync(tasksDir)) {
      console.log("No tasks directory found. Skipping tasks migration.");
      return;
    }

    const files = fs.readdirSync(tasksDir).filter((f) => f.endsWith(".json"));
    const { findUserByEmail, createTask, completeTask } = require(
      path.join(__dirname, "../helpers/dbQueries"),
    );

    let totalMigrated = 0;

    for (const file of files) {
      try {
        const email = file.replace(".json", "");
        const user = await findUserByEmail(email);

        if (!user) {
          console.log(`User ${email} not found. Skipping tasks.`);
          continue;
        }

        const taskFile = path.join(tasksDir, file);
        const rawData = fs.readFileSync(taskFile, "utf-8");
        const data = JSON.parse(rawData);

        // Migrate tasks
        if (Array.isArray(data.tasks)) {
          for (const task of data.tasks) {
            await createTask(user.id, task.name, task.time, task.ID);
            totalMigrated++;
          }
        }

        // Migrate completed tasks
        if (Array.isArray(data.completed)) {
          for (const task of data.completed) {
            await createTask(user.id, task.name, task.time, task.ID);
            await completeTask(user.id, task.ID);
            totalMigrated++;
          }
        }

        console.log(`Migrated tasks for user: ${email}`);
      } catch (err) {
        console.error(`Error migrating file ${file}:`, err.message);
      }
    }

    console.log(`✓ Migrated ${totalMigrated} tasks to database`);
  } catch (err) {
    console.error("Error migrating tasks:", err);
  }
}

async function runMigration() {
  console.log("========================================");
  console.log("Starting database migration...");
  console.log("========================================\n");

  try {
    await migrateUsersFile();
    await migrateTasksFiles();

    console.log("\n========================================");
    console.log("✓ Migration completed successfully!");
    console.log("========================================");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

// Run migration
runMigration();
