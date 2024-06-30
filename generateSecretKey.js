const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

const secretKey = generateSecretKey();
console.log(`SECRET_KEY=${secretKey}`);
