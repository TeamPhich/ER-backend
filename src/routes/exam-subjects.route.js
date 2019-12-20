const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const examSubjectsController = require("../controllers/exam-subjects.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");
const paramsMiddleware = require("../middlewares/params.middleware");
const multerMiddleware = require("../middlewares/multer.middleware");

router.get("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamId,
    examSubjectsController.getInformation);

router.post("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamId,
    paramsMiddleware.checkSubjectId,
    examSubjectsController.create);

router.delete("/:exam_subject_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamSubjectId,
    examSubjectsController.destroy);

router.put("/:exam_subject_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamSubjectId,
    paramsMiddleware.checkExamId,
    paramsMiddleware.checkSubjectId,
    examSubjectsController.update);


router.post("/:exam_subject_id/students",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    multerMiddleware.upload.single("students"),
    paramsMiddleware.checkExamSubjectId,
    examSubjectsController.importStudents);

router.get("/:exam_subject_id/students",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamSubjectId,
    examSubjectsController.getStudentsSubject);

module.exports = router;