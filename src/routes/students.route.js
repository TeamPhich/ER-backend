const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const studentsController = require("../controllers/students.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");
const multerMiddleware = require("../middlewares/multer.middleware");

router.post("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    // multerMiddleware.upload.single("students"),
    studentsController.importStudents);

module.exports = router;