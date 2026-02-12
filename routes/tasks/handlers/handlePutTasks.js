const path = require("path");
const { loadUserTasks, saveUserTasks } = require(
  path.join(process.cwd(), "./helpers/userTasks"),
);

function handlePutTasks(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const idsArray = req.params.ids.split(",");

  loadUserTasks(req.session.login.email, (err, data) => {
    if (err) throw err;
    for (let i = 0; i < idsArray.length; i++) {
      for (let j = 0; j < data.tasks.length; j++) {
        if (idsArray[i] === data.tasks[j].ID) {
          data.completed.push(data.tasks[j]);
          data.tasks.splice(j, 1);
        }
      }
    }

    saveUserTasks(
      req.session.login.email,
      data.tasks,
      data.completed,
      (saveErr) => {
        if (saveErr) throw saveErr;
        return res.status(200).send("checkboxed task to done succesful");
      },
    );
  });
}

module.exports = handlePutTasks;
