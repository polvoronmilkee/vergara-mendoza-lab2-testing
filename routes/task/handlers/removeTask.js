const path = require("path");
const { loadUserTasks, saveUserTasks } = require(
  path.join(process.cwd(), "./helpers/userTasks"),
);

function removeTask(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const id = req.params.id;
  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    data.tasks = data.tasks.filter((task) => task.ID !== id);
    saveUserTasks(
      req.session.login.email,
      data.tasks,
      data.completed,
      (saveErr) => {
        if (saveErr) throw saveErr;
        return res.status(200).send("delete task succesful");
      },
    );
  });
}

function removeTaskCompleted(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const id = req.params.id;
  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    data.completed = data.completed.filter((task) => task.ID !== id);
    saveUserTasks(
      req.session.login.email,
      data.tasks,
      data.completed,
      (saveErr) => {
        if (saveErr) throw saveErr;
        return res.status(200).send("delete done task succesful");
      },
    );
  });
}

module.exports = { removeTask, removeTaskCompleted };
