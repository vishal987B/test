const jwt = require("jsonwebtoken");
const { SECRET_KEY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION } = require("../config");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
