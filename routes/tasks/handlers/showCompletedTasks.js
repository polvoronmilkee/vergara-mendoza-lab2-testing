const path = require("path");
const { getUserCompletedTasks } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function showCompletedTasks(req, res) {
  if (!req.session.login) {
    return res.redirect("/error/");
  }

  try {
    const completed = await getUserCompletedTasks(req.session.login.userId);
    const normalizedCompleted = completed.map((task) => ({
      ...task,
      ID: task.task_id,
    }));
    return res.render("pages/completed", { completed: normalizedCompleted });
  } catch (err) {
    console.error("Error loading completed tasks:", err);
    return res.redirect("/error/");
  }
}

module.exports = showCompletedTasks;
