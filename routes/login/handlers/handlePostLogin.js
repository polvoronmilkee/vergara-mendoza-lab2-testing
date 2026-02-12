const fs = require("fs");
const path = require("path");
const strftime = require("strftime");
const crypto = require(path.join(process.cwd(), "./helpers/crypto"));
const decrypt = crypto.decrypt;

function handlePostLogin(req, res) {
  const { email, password } = req.body;
  let autentification = false;

  fs.readFile("./data-db/users_txt.txt", "utf-8", (err, data) => {
    if (err) throw err;
    const usersArrEncrypted = data.split("\r\n"); // (/\r?\n/)
    const usersArrDecrypted = usersArrEncrypted
      .filter((line) => line.trim() !== "")
      .map((aAuthLine) => decrypt(aAuthLine))
      .filter((user) => typeof user === "string" && user.length > 0);

    usersArrDecrypted.forEach((user) => {
      const [emailDB, passDB] = user.split(":");
      if (emailDB === email && passDB === password) {
        autentification = true;
        req.session.login = { email };
        console.log("------------ new login --------------");
        console.log("user: " + email);
        console.log("pass: " + password);
        console.log("logged at: " + strftime("%F:%T", new Date()));
        console.log("-------------------------------------");
      }
    });
    if (autentification) res.redirect("/tasks/");
    else res.redirect("/error");
  });
}

module.exports = handlePostLogin;
