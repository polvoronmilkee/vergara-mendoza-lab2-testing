const path = require("path");
const { completeTask } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function updateTask(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const id = req.params.id;

  try {
    await completeTask(req.session.login.userId, id);
    return res.status(200).send("change to done succesful");
  } catch (err) {
    console.error("Error updating task:", err);
    return res.status(500).send("error updating task");
  }
}

module.exports = updateTask;
