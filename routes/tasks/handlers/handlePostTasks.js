const strftime = require("strftime");
const path = require("path");
const { loadUserTasks, saveUserTasks } = require(
  path.join(process.cwd(), "./helpers/userTasks"),
);

function handlePostTasks(req, res) {
  if (!req.session.login) {
    return res.redirect("/error/");
  }

  const taskName = req.body.task;
  const date = strftime("%B %d, %Y %H:%M", new Date());
  const createId = () => "_" + Math.random().toString(36).substr(2, 9);
  const newTask = {
    name: `${taskName}`,
    time: `(Created at: ${date})`,
    ID: createId(),
  };

  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    data.tasks.push(newTask);
    saveUserTasks(
      req.session.login.email,
      data.tasks,
      data.completed,
      (saveErr) => {
        if (saveErr) throw saveErr;
        return res.redirect("/tasks/");
      },
    );
  });
}

module.exports = handlePostTasks;
