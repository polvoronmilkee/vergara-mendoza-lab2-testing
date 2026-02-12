const fs = require("fs");

function parseFirstJsonObject(raw) {
  if (!raw) {
    return null;
  }
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (ch === "\\") {
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = raw.slice(0, i + 1);
        try {
          return JSON.parse(candidate);
        } catch (err) {
          return null;
        }
      }
    }
  }
  return null;
}

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
      const salvaged = parseFirstJsonObject(data);
      if (!salvaged) {
        return callback(parseErr);
      }
      const tasks = Array.isArray(salvaged.tasks) ? salvaged.tasks : [];
      const completed = Array.isArray(salvaged.completed) ? salvaged.completed : [];
      const payload = { tasks, completed };
      fs.writeFile(
        dataFileName,
        JSON.stringify(payload),
        { encoding: "utf-8" },
        () => callback(null, payload),
      );
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
