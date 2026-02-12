const fs = require("fs");
const strftime = require("strftime");
const path = require("path");
const crypto = require(path.join(process.cwd(), "./helpers/crypto"));
const decrypt = crypto.decrypt;
const encrypt = crypto.encrypt;

function isNewEncryptedPayload(line) {
  if (!line || typeof line !== "string") {
    return false;
  }
  const trimmed = line.trim();
  if (!trimmed.startsWith("{")) {
    return false;
  }
  try {
    const parsed = JSON.parse(trimmed);
    return Boolean(parsed && parsed.iv && parsed.encryptedData);
  } catch (err) {
    return false;
  }
}

function normalizeUsersFile(rawData) {
  const lines = rawData.split("\r\n").filter((line) => line.trim() !== "");
  const normalizedLines = [];
  const decryptedUsers = [];
  let didChange = false;

  lines.forEach((line) => {
    if (isNewEncryptedPayload(line)) {
      const decrypted = decrypt(line);
      if (typeof decrypted === "string" && decrypted.length > 0) {
        normalizedLines.push(line);
        decryptedUsers.push(decrypted);
      } else {
        didChange = true;
      }
      return;
    }

    const decrypted = decrypt(line);
    if (typeof decrypted === "string" && decrypted.length > 0) {
      normalizedLines.push(encrypt(decrypted));
      decryptedUsers.push(decrypted);
      didChange = true;
    } else {
      didChange = true;
    }
  });

  return { normalizedLines, decryptedUsers, didChange };
}

function handlePostRegistry(req, res) {
  const { email, password } = req.body;
  const dataToWrite = `${email}:${password}`;
  const encryptedData = "\r\n" + encrypt(dataToWrite);
  let existentUser = false;

  fs.readFile("./data-db/users_txt.txt", "utf-8", function (err, data) {
    if (err) throw err;
    const { normalizedLines, decryptedUsers, didChange } =
      normalizeUsersFile(data);

    if (didChange) {
      const normalizedData =
        normalizedLines.length > 0 ? normalizedLines.join("\r\n") + "\r\n" : "";
      fs.writeFile(
        "./data-db/users_txt.txt",
        normalizedData,
        { encoding: "utf-8" },
        (err) => {
          if (err) throw err;
        },
      );
    }

    decryptedUsers.forEach((userData) => {
      const [emailDB] = userData.split(":");
      if (emailDB === email) {
        existentUser = true;
      }
    });
    if (existentUser) {
      console.log("Email already in use");
      res.redirect("/registry/"); // flash message
    } else {
      fs.appendFile("./data-db/users_txt.txt", encryptedData, function (err) {
        if (err) throw err;
        console.log("------ New registry --------------");
        console.log("email: " + email);
        console.log("password: " + password);
        console.log("registered at: " + strftime("%F:%T", new Date()));
        console.log("encrypted as: " + encryptedData);
        console.log("----------------------------------");
        createCleanUserTask(email);
        res.redirect("/");
      });
    }
  });
}

function createCleanUserTask(userID) {
  const newUserTask = { tasks: [], completed: [] };
  const usersTasksDir = "./data-db/users_tasks";
  fs.mkdir(usersTasksDir, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(
      `${usersTasksDir}/${userID}.json`,
      JSON.stringify(newUserTask),
      { encoding: "utf-8" },
      (writeErr) => {
        if (writeErr) throw writeErr;
      },
    );
  });
}

module.exports = handlePostRegistry;
