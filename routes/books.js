const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books");
const userAuthentication = require("../middleware/auth");

router.get("/books-page", booksController.getBooksPage);

router.post(
  "/register-book",
  userAuthentication.authentication,
  booksController.postBooks
);

router.get(
  "/books",
  userAuthentication.authentication,
  booksController.getBooks
);

router.delete("/books/:id", booksController.deleteBook);

module.exports = router;
