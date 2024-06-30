const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { PORT } = require("./config")
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
require("./db/connection");
const swaggerDocument = require("./swagger.json");
const app = express();
const port = PORT || 4000;

app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/user", userRoutes);
app.use("/api/discussion", discussionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
