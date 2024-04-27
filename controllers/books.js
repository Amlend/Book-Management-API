const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");
const Books = require("../models/books");

exports.getBooksPage = (req, res, next) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "views", "books.html"));
};

exports.postBooks = async (req, res, next) => {
  const t = await sequelize.transaction();
  const userBook = {
    title: req.body.title,
    author: req.body.author,
    publicationYear: req.body.publicationYear,
  };
  try {
    Books.create(
      {
        title: userBook.title,
        author: userBook.author,
        publicationYear: userBook.publicationYear,
        userId: req.user.id,
      },
      { transaction: t }
    )
      .then(async () => {
        await t.commit();
        console.log(" Book Created..");
        next();
      })
      .catch(async (err) => {
        await t.rollback();
        console.log(err);
      });
  } catch (err) {
    throw new Error(err);
  }
};

exports.getBooks = async (req, res, next) => {
  const t = await sequelize.transaction();
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 2; // Default items per page
  const sortBy = req.query.sortBy || "id"; // Default sort by ID
  const sortOrder = req.query.sortOrder || "ASC"; // Default ascending order

  try {
    const offset = (page - 1) * limit; // Calculate offset for pagination

    const books = await Books.findAll({
      where: { userId: req.user.id },
      transaction: t,
      offset,
      limit,
      order: [[sortBy, sortOrder]],
    });

    const totalBooksCount = await Books.count({
      where: { userId: req.user.id },
      transaction: t,
    });

    res.status(200).json({ allBooks: books, totalCount: totalBooksCount });

    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error });
  }
};

exports.deleteBook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // deleting expense
    const bookId = req.params.id;
    await Books.destroy({ where: { id: bookId }, transaction: t });
    res.sendStatus(200);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.sendStatus(500).json(error);
  }
};
