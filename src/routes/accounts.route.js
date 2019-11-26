const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const accountController = require("../controllers/accounts.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/login", accountController.login);
router.post("/register", tokenMiddleware.verify, privilegesMiddleware.verify(1),accountController.register);

module.exports = router;