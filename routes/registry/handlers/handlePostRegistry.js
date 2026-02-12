const path = require("path");
const strftime = require("strftime");
const { createUser, findUserByEmail } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);

async function handlePostRegistry(req, res) {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log("Email already in use");
      return res.redirect("/registry/");
    }

    // Create new user
    await createUser(email, password);

    console.log("------ New registry --------------");
    console.log("email: " + email);
    console.log("password: " + password);
    console.log("registered at: " + strftime("%F:%T", new Date()));
    console.log("----------------------------------");

    return res.redirect("/");
  } catch (err) {
    console.error("Registry error:", err);
    return res.redirect("/registry/");
  }
}

module.exports = handlePostRegistry;
