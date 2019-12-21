const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const shiftsRoomsController = require("../controllers/shifts-rooms.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");
const paramsMiddleware = require("../middlewares/params.middleware");

router.get("/shift/:shift_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkShiftId,
    shiftsRoomsController.getInformation);

router.post("/shift/:shift_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkShiftId,
    paramsMiddleware.checkRoomIdExisted,
    paramsMiddleware.checkExamSubjectId,
    shiftsRoomsController.create);

router.put("/:shift_room",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    shiftsRoomsController.update);

router.delete("/:shift_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    shiftsRoomsController.update
);

module.exports = router;