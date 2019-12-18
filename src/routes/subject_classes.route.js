const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const subjectClassesController = require("../controllers/subject_classes.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.get("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    subjectClassesController.getInformation);

router.post("/exam/:exam_id/subject/:subject_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    subjectClassesController.create);


module.exports = router;