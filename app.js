const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./util/database");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
