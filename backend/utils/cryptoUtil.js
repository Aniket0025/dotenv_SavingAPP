const crypto = require("crypto");

const algorithm = "aes-256-cbc"; // needs 32-byte key and 16-byte IV
const rawKey = process.env.ENCRYPTION_KEY || "";
const rawIv = process.env.ENCRYPTION_IV || "";

// Derive proper sizes deterministically from the provided secrets
const key = crypto.createHash("sha256").update(rawKey, "utf8").digest(); // 32 bytes
const iv = crypto.createHash("md5").update(rawIv, "utf8").digest(); // 16 bytes

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(String(encryptedText), "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function tryDecryptMaybePlain(value) {
  try {
    return decrypt(value);
  } catch (_) {
    // Fallback for legacy/plain values
    return value;
  }
}

module.exports = { encrypt, decrypt, tryDecryptMaybePlain };
