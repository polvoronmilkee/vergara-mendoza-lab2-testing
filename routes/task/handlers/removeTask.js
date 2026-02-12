const path = require("path");
const { deleteTask, deleteCompletedTask } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function removeTask(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const id = req.params.id;

  try {
    await deleteTask(req.session.login.userId, id);
    return res.status(200).send("delete task succesful");
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).send("error deleting task");
  }
}

async function removeTaskCompleted(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const id = req.params.id;

  try {
    await deleteCompletedTask(req.session.login.userId, id);
    return res.status(200).send("delete done task succesful");
  } catch (err) {
    console.error("Error deleting completed task:", err);
    return res.status(500).send("error deleting completed task");
  }
}

module.exports = { removeTask, removeTaskCompleted };
