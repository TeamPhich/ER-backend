const express = require("express");
const router = express.Router();
const token = require("../middlewares/tokens.middleware");
const accountController = require("../controllers/accounts.controller");

router.post("/login", accountController.login);
router.post("/register", accountController.register);

module.exports = router;