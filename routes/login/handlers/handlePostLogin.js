const path = require("path");
const strftime = require("strftime");
const crypto = require(path.join(process.cwd(), "./helpers/crypto"));
const { findUserByEmail } = require(
  path.join(process.cwd(), "./helpers/dbQueries"),
);
const decrypt = crypto.decrypt;

async function handlePostLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.redirect("/error");
    }

    // Decrypt stored password
    const encryptedPayload = JSON.stringify({
      encryptedData: user.password_encrypted,
      iv: user.iv,
    });
    const decrypted = decrypt(encryptedPayload);

    if (!decrypted) {
      return res.redirect("/error");
    }

    const [emailDB, passDB] = decrypted.split(":");

    if (emailDB === email && passDB === password) {
      req.session.login = { email, userId: user.id };
      console.log("------------ new login --------------");
      console.log("user: " + email);
      console.log("pass: " + password);
      console.log("logged at: " + strftime("%F:%T", new Date()));
      console.log("-------------------------------------");
      return res.redirect("/tasks/");
    } else {
      return res.redirect("/error");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.redirect("/error");
  }
}

module.exports = handlePostLogin;
