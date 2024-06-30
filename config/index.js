require("dotenv").config();

module.exports = {
  URL: process.env.URL,
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
