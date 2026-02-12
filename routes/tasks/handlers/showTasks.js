const path = require("path");
const { getUserTasks } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function showTasks(req, res) {
  if (!req.session.login) {
    return res.redirect("/error/");
  }

  try {
    const tasks = await getUserTasks(req.session.login.userId);
    return res.render("pages/tasks", { tasks });
  } catch (err) {
    console.error("Error loading tasks:", err);
    return res.redirect("/error/");
  }
}

module.exports = showTasks;
