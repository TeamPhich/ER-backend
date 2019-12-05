const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const examsController = require("../controllers/exams.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/", tokenMiddleware.verify, privilegesMiddleware.verify(1), examsController.create);
router.get("/", tokenMiddleware.verify, privilegesMiddleware.verify(1), examsController.getInformation);

module.exports = router;
