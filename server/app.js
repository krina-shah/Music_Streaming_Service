const express = require("express");
const configRoutes = require("./routes");
const cors = require("cors");
const compression = require("compression");
const app = express();
const PORT = 3008;

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
