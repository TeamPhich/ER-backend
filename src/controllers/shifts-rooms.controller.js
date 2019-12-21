const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const deleteDBUtil = require("../utils/deleteDB.util");
const Op = db.Sequelize.Op;

async function getInformation(req, res) {
    try {
        const {shift_id} = req.params;
        let {page, pageSize, keywords} = req.query;
        const {exam_id} = req.params;
        if (!page) page = 1;
        if (!pageSize) pageSize = 15;
        const offset = (page - 1) * pageSize;
        const limit = Number(pageSize);
        let conditionQuery = {
            offset,
            limit,
            where: {
                exam_id
            },
            include: {
                model: db.subjects,
                attributes: ["name", "credit"]
            }
        };
        if (keywords) {
            keywords = "+" + keywords + "*";
            conditionQuery.include.where = db.Sequelize.literal('MATCH (name) AGAINST (:name IN BOOLEAN MODE)');
            conditionQuery.replacements = {
                name: keywords
            };
        }
        let exam_subjects = await db.exam_subjects.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function create(req, res) {
    try {
        const {shift_id} = req.params;
        const {exam_subject_id, room_id} = req.body;
        const existedShiftRoom = await db.shift_room.findAll({
            where: {
                [Op.or]: [
                    {
                        exam_subject_id,
                        room_id
                    },
                    {
                        exam_subject_id,
                        shift_id
                    },
                    {
                        room_id,
                        shift_id
                    }
                ]
            }
        });
        if (existedShiftRoom.length)
            throw new Error("Ca thi đã tồn tại");
        await db.shift_room.create({
            shift_id,
            exam_subject_id,
            current_slot: 0,
            room_id
        });
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