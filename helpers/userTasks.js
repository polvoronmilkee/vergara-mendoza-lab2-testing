const fs = require("fs");

function loadUserTasks(email, callback) {
  const dataFileName = `./data-db/users_tasks/${email}.json`;
  fs.readFile(dataFileName, "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        return callback(null, { tasks: [], completed: [] });
      }
      return callback(err);
    }

    try {
      const parsed = JSON.parse(data || "{}");
      const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
      const completed = Array.isArray(parsed.completed) ? parsed.completed : [];
      return callback(null, { tasks, completed });
    } catch (parseErr) {
      return callback(parseErr);
    }
  });
}

function saveUserTasks(email, tasks, completed, callback) {
  const dataFileName = `./data-db/users_tasks/${email}.json`;
  const payload = { tasks, completed };
  fs.writeFile(
    dataFileName,
    JSON.stringify(payload),
    { encoding: "utf-8" },
    callback,
  );
}

module.exports = { loadUserTasks, saveUserTasks };
