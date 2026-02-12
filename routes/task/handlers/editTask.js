const path = require("path");
const { loadUserTasks, saveUserTasks } = require(
  path.join(process.cwd(), "./helpers/userTasks"),
);

function editTask(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const newName = req.body.name;
  const editedID = req.body.ID;

  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.tasks.length; i++) {
      if (data.tasks[i].ID === editedID) {
        data.tasks[i].name = newName;
        break;
      }
    }
    saveUserTasks(
      req.session.login.email,
      data.tasks,
      data.completed,
      (saveErr) => {
        if (saveErr) throw saveErr;
        return res.status(200).send("ok edit done");
      },
    );
  });
}

module.exports = editTask;
