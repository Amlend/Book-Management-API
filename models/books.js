const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const expenses = sequelize.define("books", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  author: Sequelize.STRING,
  publicationYear: Sequelize.INTEGER,
});

module.exports = expenses;
