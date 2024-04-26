const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authentication = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      console.log(req.user.id);

      next();
    });
  } catch (error) {
    console.log(error, "Middleware error");
  }
};
