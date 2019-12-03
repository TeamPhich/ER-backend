const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const subjectsController = require("../controllers/subjects.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    subjectsController.create);

router.get("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    subjectsController.getInformation);

router.delete("/:subject_id", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    subjectsController.deleteSubject);

router.put("/", tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    subjectsController.updateSubject);

module.exports = router;