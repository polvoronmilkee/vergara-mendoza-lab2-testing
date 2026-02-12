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
    return res.render("pages/completed", { completed });
  } catch (err) {
    console.error("Error loading completed tasks:", err);
    return res.redirect("/error/");
  }
}

module.exports = showCompletedTasks;
