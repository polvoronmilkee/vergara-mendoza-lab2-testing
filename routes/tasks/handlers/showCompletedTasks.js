const path = require("path");
const { loadUserTasks } = require(
  path.join(process.cwd(), "./helpers/userTasks"),
);

function showCompletedTasks(req, res) {
  if (!req.session.login) {
    return res.redirect("/error/");
  }

  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    return res.render("pages/completed", { completed: data.completed });
  });
}

module.exports = showCompletedTasks;
