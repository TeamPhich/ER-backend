const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const shiftsController = require("../controllers/shifts.controller");
const paramsMiddleware = require("../middlewares/params.middleware");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamId,
    shiftsController.create);

router.get("/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkExamId,
    shiftsController.getInformation);

router.put("/:shift_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    shiftsController.updateInformation);

router.delete("/:room_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkRoomIdExisted,
    shiftsController.deleteShift);

module.exports = router;
