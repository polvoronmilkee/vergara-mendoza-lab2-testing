const path = require("path");
const { updateTaskName } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function editTask(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const newName = req.body.name;
  const editedID = req.body.ID;

  try {
    await updateTaskName(editedID, newName);
    return res.status(200).send("ok edit done");
  } catch (err) {
    console.error("Error editing task:", err);
    return res.status(500).send("error editing task");
  }
}

module.exports = editTask;
