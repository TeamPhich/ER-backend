const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const deleteDBUtil = require("../utils/deleteDB.util");
const Op = db.Sequelize.Op;

async function getInformation(req, res) {
    try {
        const {shift_id, exam_id} = req.params;
        let {page, pageSize, keywords} = req.query;
        if (!page) page = 1;
        if (!pageSize) pageSize = 15;
        const offset = (page - 1) * pageSize;
        const limit = Number(pageSize);
        let conditionQuery = {
            offset,
            limit,
            where: {
                shift_id,

            },
            include: [{
                model: db.exam_subjects,
                include: [{
                    model: db.subjects,
                }]
            }, {
                model: db.rooms,
            }]
        };
        if (keywords) {
            keywords = "+" + keywords + "*";
            const exam_subject = await db.exam_subjects.findAll({
                where: {
                    exam_id
                },
                include: {
                    model: db.subjects,
                    where: db.Sequelize.literal('MATCH (name) AGAINST (:name IN BOOLEAN MODE)')
                },
                replacements: {
                    name: keywords
                }
            });
            let exam_subject_id = [];
            for (let i = 0; i < exam_subject.length; i++) {
                exam_subject_id.push(exam_subject[i].dataValues.id)
            }
            conditionQuery.where.exam_subject_id = {
                [Op.in]: exam_subject_id
            };
        }
        let shifts_rooms = await db.shift_room.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {shifts_rooms}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function create(req, res) {
    try {
        const {examOfExamSubject, examOfShiftId} = req;
        if (examOfExamSubject !== examOfShiftId) throw new Error("examSubject and shift is different exam");
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

async function updateRooms(req, res) {
    try {
        const {shift_room_id, shift_id} = req.params;
        const {room_id} = req.body;
        const roomExistedInShift = await db.shift_room.findAll({
            where: {
                id: {
                    [Op.not]: [shift_room_id]
                },
                room_id,
                shift_id
            }
        });
        if (roomExistedInShift.length) throw new Error("room is existed in shift");
        await db.shift_room.update({
            room_id
        }, {
            where: {
                id: shift_room_id
            }
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function destroy(req, res) {
    try {
        const {shift_room_id} = req.params;
        await deleteDBUtil.deleteShiftRoom([shift_room_id]);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    updateRooms,
    destroy
};