const crypto = require("crypto");
const createId = () => "_" + Math.random().toString(36).substr(2, 9);
const cryptoPass = "secret"; // createId
const algorithm = "aes-256-ctr";
const key = crypto.createHash("sha256").update(cryptoPass).digest();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");

  return JSON.stringify({
    iv: iv.toString("hex"),
    encryptedData: crypted,
  });
}

function decrypt(payload) {
  if (!payload || typeof payload !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(payload);
    if (parsed && parsed.iv && parsed.encryptedData) {
      const iv = Buffer.from(parsed.iv, "hex");
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let dec = decipher.update(parsed.encryptedData, "hex", "utf8");
      dec += decipher.final("utf8");
      return dec;
    }
  } catch (err) {
    // Not JSON; fall through to legacy handling.
  }

  // Legacy hex-only payloads (no IV stored) are not reliably decryptable.
  const isHex = /^[0-9a-fA-F]+$/.test(payload) && payload.length % 2 === 0;
  if (!isHex) {
    return null;
  }

  try {
    // Best-effort: attempt with a zero IV to avoid crashing on old entries.
    const legacyIv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(algorithm, key, legacyIv);
    let dec = decipher.update(payload, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  } catch (err) {
    return null;
  }
}

module.exports = { encrypt, decrypt };
