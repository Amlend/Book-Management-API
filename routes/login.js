const express = require("express");
const loginController = require("../controllers/login");
const router = express.Router();

router.get("/", loginController.getLoginPage);
router.post("/login/validiation", loginController.postValidiateLogin);

module.exports = router;
