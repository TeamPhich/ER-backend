const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokens.middleware");
const roomsController = require("../controllers/rooms.controller");
const paramsMiddleware = require("../middlewares/params.middleware");
const privilegesMiddleware = require("../middlewares/privileges.middleware");

router.post("/",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkRoomNameExisted,
    roomsController.create);

router.get("/",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    roomsController.getInformation);

router.put("/:room_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkRoomIdExisted,
    roomsController.updateInformation);

router.delete("/:room_id",
    tokenMiddleware.verify,
    privilegesMiddleware.verify(1),
    paramsMiddleware.checkRoomIdExisted,
    roomsController.deleteRooms);

module.exports = router;
