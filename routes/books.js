const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books");
const userAuthentication = require("../middleware/auth");

router.get("/books", booksController.getBooksPage);

module.exports = router;
