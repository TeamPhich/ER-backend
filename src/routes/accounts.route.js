const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const accountController = require("../controllers/accounts.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/login", accountController.login);
router.post("/register",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    accountController.register);
router.get("/profile",
    tokenMiddleware.verify,
    accountController.getInformation);
router.put("/profile",
    tokenMiddleware.verify,
    accountController.updateProfile);
router.put("/passwords",
    tokenMiddleware.verify,
    accountController.changePassword);
router.put("/students/:mssv/passwords",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    accountController.resetPassword);
module.exports = router;