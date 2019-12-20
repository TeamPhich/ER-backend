const db = require("../models/index");
const deleteDBUtil = require("../utils/deleteDB.util");
const responseUtil = require("../utils/responses.util");

async function create(req, res) {
    try {
        const {name, slot} = req.body;
        if (!slot) throw new Error("slot params fields is missing");
        await db.rooms.create({
            name,
            slot
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getInformation(req, res) {
    try {
        let {page, pageSize, keywords} = req.query;
        if (!page) page = 1;
        if (!pageSize) pageSize = 15;
        const offset = (page - 1) * pageSize;
        const limit = Number(pageSize);
        let conditionQuery = {
            offset,
            limit
        };
        if (keywords) {
            keywords = "+" + keywords + "%";
            conditionQuery.replacements = {
                name: keywords
            };
            if (!req.query) conditionQuery.limit = 5;
            conditionQuery.where = db.Sequelize.literal('MATCH (name) AGAINST (:name IN BOOLEAN MODE)');
            conditionQuery.replacements = {
                name: keywords
            };
        }
        let rooms = await db.rooms.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {rooms}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function updateInformation(req, res) {
    try {
        const {new_name, new_slot} = req.body;
        const {room_id} = req.params;
        const existedName = await db.rooms.findAll({
            where: {
                name: new_name,
                [db.Sequelize.Op.not]: [{id: room_id}]
            }
        });
        if (existedName.length) throw new Error("Phòng thi đã tồn tại");
        await db.rooms.update({
            name: new_name,
            slot: new_slot
        }, {
            where: {
                id: room_id
            }
        });

        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function deleteRooms(req, res) {
    try {
        const {room_id} = req.params;
        await deleteDBUtil.deleteRooms(room_id);
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    updateInformation,
    deleteRooms
};