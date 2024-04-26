const express = require("express");
const User = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");

exports.getLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
};

exports.postValidiateLogin = async (req, res, next) => {
  const userValidiate = {
    email: req.body.email,
    password: req.body.password,
  };

  function generateWebToken(id) {
    return jwt.sign({ userId: id }, "123456abcdef");
  }

  try {
    await User.findAll({ where: { email: userValidiate.email } })

      .then((user) => {
        if (user[0].email === userValidiate.email) {
          return user[0];
        }
      })
      .then((user) => {
        bcrypt.compare(userValidiate.password, user.password, (err, result) => {
          if (result === true) {
            res.status(200).json({
              success: true,
              message: "User logged successfully",
              token: generateWebToken(user.id),
            });
          } else {
            return res
              .status(500)
              .json({ success: false, message: "Wrong Password" });
          }
        });
      })

      .catch((err) => {
        res.status(404).send("User Not Found 404");
      });
  } catch (err) {
    console.log(err);
  }
};
