const path = require("path");
const { loadUserTasks, saveUserTasks } = require(
  path.join(process.cwd(), "./helpers/userTasks"),
);

function updateTask(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const id = req.params.id;
  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.tasks.length; i++) {
      if (data.tasks[i].ID === id) {
        data.completed.push(data.tasks[i]);
        data.tasks.splice(i, 1);
        break;
      }
    }
    saveUserTasks(
      req.session.login.email,
      data.tasks,
      data.completed,
      (saveErr) => {
        if (saveErr) throw saveErr;
        return res.status(200).send("change to done succesful");
      },
    );
  });
}

module.exports = updateTask;
