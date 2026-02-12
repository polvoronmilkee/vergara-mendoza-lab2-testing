const path = require("path");
const { completeMultipleTasks } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function handlePutTasks(req, res) {
  if (!req.session.login) {
    return res.status(401).send("unauthorized");
  }

  const idsArray = req.params.ids.split(",");

  try {
    await completeMultipleTasks(req.session.login.userId, idsArray);
    return res.status(200).send("checkboxed task to done succesful");
  } catch (err) {
    console.error("Error completing tasks:", err);
    return res.status(500).send("error completing tasks");
  }
}

module.exports = handlePutTasks;
