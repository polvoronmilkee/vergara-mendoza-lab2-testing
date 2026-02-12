const strftime = require("strftime");
const path = require("path");
const { createTask } = require(path.join(process.cwd(), "./helpers/dbQueries"));

async function handlePostTasks(req, res) {
  if (!req.session.login) {
    return res.redirect("/error/");
  }

  const taskName = req.body.task;
  const date = strftime("%B %d, %Y %H:%M", new Date());
  const createId = () => "_" + Math.random().toString(36).substr(2, 9);
  const taskId = createId();

  try {
    await createTask(
      req.session.login.userId,
      taskName,
      `(Created at: ${date})`,
      taskId,
    );
    return res.redirect("/tasks/");
  } catch (err) {
    console.error("Error creating task:", err);
    return res.redirect("/tasks/");
  }
}

module.exports = handlePostTasks;
