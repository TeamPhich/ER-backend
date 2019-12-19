const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const examSubjectsController = require("../controllers/exam-subjects.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");
const examSubjectMiddleware = require("../middlewares/exam-subject.middleware");
const multerMiddleware = require("../middlewares/multer.middleware");

router.get("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    examSubjectMiddleware.checkExamId,
    examSubjectsController.getInformation);

router.post("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    examSubjectMiddleware.checkExamId,
    examSubjectsController.create);

router.delete("/:exam_subject_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    examSubjectMiddleware.checkExamSubjectId,
    examSubjectsController.destroy);

router.put("/:exam_subject_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    examSubjectMiddleware.checkExamSubjectId,
    examSubjectMiddleware.checkExamId,
    examSubjectMiddleware.checkSubjectId,
    examSubjectsController.update);


router.post("/:exam_subject_id/students",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    multerMiddleware.upload.single("students"),
    examSubjectMiddleware.checkExamSubjectId,
    examSubjectsController.importStudents);

router.get("/:exam_subject_id/students",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    examSubjectMiddleware.checkExamSubjectId,
    examSubjectsController.getStudentsSubject);

module.exports = router;