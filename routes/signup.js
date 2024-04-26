const express = require("express");
const signUpController = require("../controllers/signup");
const router = express.Router();

router.get("/sign-up", signUpController.getSignUpPage);
router.post("/register", signUpController.postSignUpUser);

module.exports = router;
