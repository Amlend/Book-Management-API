const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./util/database");

const loginRoutes = require("./routes/login");
const signUpRoutes = require("./routes/signup");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public", "views")));
app.use(express.static(path.join(__dirname, "public", "js")));

// Routers
app.use(loginRoutes);
app.use(signUpRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
