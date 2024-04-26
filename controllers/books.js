const express = require("express");
const path = require("path");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");

exports.getBooksPage = (req, res, next) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "views", "books.html"));
};
