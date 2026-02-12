const db = require("./db");
const crypto = require("./crypto");

// User authentication functions
async function findUserByEmail(email) {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query(
      "SELECT id, email, password_encrypted, iv FROM users WHERE email = ?",
      [email],
    );
    return results.length > 0 ? results[0] : null;
  } finally {
    connection.release();
  }
}

async function createUser(email, password) {
  const encrypted = crypto.encrypt(`${email}:${password}`);
  const parsedPayload = JSON.parse(encrypted);

  const connection = await db.getConnection();
  try {
    await connection.query(
      "INSERT INTO users (email, password_encrypted, iv) VALUES (?, ?, ?)",
      [email, parsedPayload.encryptedData, parsedPayload.iv],
    );
  } finally {
    connection.release();
  }
}

async function getAllUsers() {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query("SELECT id, email FROM users");
    return results;
  } finally {
    connection.release();
  }
}

// Task functions
async function getUserTasks(userId) {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query(
      "SELECT * FROM tasks WHERE user_id = ? AND is_completed = FALSE",
      [userId],
    );
    return results;
  } finally {
    connection.release();
  }
}

async function getUserCompletedTasks(userId) {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query(
      "SELECT * FROM completed_tasks WHERE user_id = ?",
      [userId],
    );
    return results;
  } finally {
    connection.release();
  }
}

async function createTask(userId, taskName, taskTime, taskId) {
  const connection = await db.getConnection();
  try {
    await connection.query(
      "INSERT INTO tasks (user_id, name, time, task_id, is_completed) VALUES (?, ?, ?, ?, FALSE)",
      [userId, taskName, taskTime, taskId],
    );
  } finally {
    connection.release();
  }
}

async function completeTask(userId, taskId) {
  const connection = await db.getConnection();
  try {
    // Get task info
    const [tasks] = await connection.query(
      "SELECT * FROM tasks WHERE task_id = ? AND user_id = ?",
      [taskId, userId],
    );

    if (tasks.length === 0) {
      throw new Error("Task not found");
    }

    const task = tasks[0];

    // Move to completed_tasks
    await connection.query(
      "INSERT INTO completed_tasks (user_id, name, time, task_id) VALUES (?, ?, ?, ?)",
      [userId, task.name, task.time, taskId],
    );

    // Delete from active tasks
    await connection.query("DELETE FROM tasks WHERE task_id = ?", [taskId]);
  } finally {
    connection.release();
  }
}

async function updateTaskName(taskId, newName) {
  const connection = await db.getConnection();
  try {
    await connection.query("UPDATE tasks SET name = ? WHERE task_id = ?", [
      newName,
      taskId,
    ]);
  } finally {
    connection.release();
  }
}

async function deleteTask(userid, taskId) {
  const connection = await db.getConnection();
  try {
    await connection.query(
      "DELETE FROM tasks WHERE task_id = ? AND user_id = ?",
      [taskId, userid],
    );
  } finally {
    connection.release();
  }
}

async function deleteCompletedTask(userId, taskId) {
  const connection = await db.getConnection();
  try {
    await connection.query(
      "DELETE FROM completed_tasks WHERE task_id = ? AND user_id = ?",
      [taskId, userId],
    );
  } finally {
    connection.release();
  }
}

async function completeMultipleTasks(userId, taskIds) {
  const connection = await db.getConnection();
  try {
    for (const taskId of taskIds) {
      await completeTask(userId, taskId);
    }
  } finally {
    connection.release();
  }
}

module.exports = {
  findUserByEmail,
  createUser,
  getAllUsers,
  getUserTasks,
  getUserCompletedTasks,
  createTask,
  completeTask,
  updateTaskName,
  deleteTask,
  deleteCompletedTask,
  completeMultipleTasks,
};
