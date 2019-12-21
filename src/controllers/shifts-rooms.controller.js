const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const deleteDBUtil = require("../utils/deleteDB.util");
const Op = db.Sequelize.Op;

async function getInformation(req, res) {
    try {
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}
async function create(req, res) {
    try {
        const {shift_id} = req.params;
        const {subject_id, room_id} = req.body;
        const existedShiftRoom = await db.shift_room.findAll({
            where: {
                subject_id,
                room_id
            }
        });
        if(existedShiftRoom.length)
            throw new Error("Phòng thi và môn thi đã tồn tại trong ca thi");
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}
async function update(req, res) {
    try {
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function destroy(req, res) {
    try {
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    update,
    destroy
};