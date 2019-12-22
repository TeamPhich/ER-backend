const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const studentsController = require("../controllers/students.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");
const multerMiddleware = require("../middlewares/multer.middleware");

router.post("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    multerMiddleware.upload.single("students"),
    studentsController.importStudents);

router.get("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    studentsController.getInfomation);

router.put("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    studentsController.putInformation);

router.delete("/:student_id", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    studentsController.deleteStudent);

router.get("/exam_subject",
    tokenMiddleware.verify,
    studentsController.getExamSubjects);

module.exports = router;