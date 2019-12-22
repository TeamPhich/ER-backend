const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const shiftsRoomsController = require("../controllers/shifts-rooms.controller");
const privilegesMiddleware = require("../middlewares/privileges.middleware");
const paramsMiddleware = require("../middlewares/params.middleware");

router.get("/shift/:shift_id/exam/:exam_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkShiftId,
    paramsMiddleware.checkExamId,
    shiftsRoomsController.getInformation);

router.post("/shift/:shift_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkShiftId,
    paramsMiddleware.checkRoomIdExisted,
    paramsMiddleware.checkExamSubjectId,
    shiftsRoomsController.create);

router.put("/:shift_room_id/shift/:shift_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkShiftRoomId,
    paramsMiddleware.checkRoomIdExisted,
    paramsMiddleware.checkShiftId,
    shiftsRoomsController.updateRooms);

router.delete("/:shift_room_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkShiftRoomId,
    shiftsRoomsController.destroy);

module.exports = router;