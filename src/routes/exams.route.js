const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const examsController = require("../controllers/exams.controller");
const paramsMiddleWare = require("../middlewares/params.middleware");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleWare.checkStartFinishTimeExam,
    examsController.create);
router.get("/",
    tokenMiddleware.verify,
    examsController.getInformation);
router.put("/",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleWare.checkStartFinishTimeExam,
    examsController.updateInformation);
router.delete("/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    examsController.deleteExams);

module.exports = router;
