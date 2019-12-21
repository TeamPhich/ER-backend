const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const excelToJson = require("convert-excel-to-json");
const Op = db.Sequelize.Op;


async function checkExamId(req, res, next) {
    try {
        let {exam_id} = req.params;
        if (!exam_id) exam_id = req.body.exam_id;
        if (!exam_id) throw new Error("Exam_id params fields is missing");
        const existExam = await db.exams.findAll({
            where: {
                id: exam_id
            }
        });
        if (!existExam.length) throw new Error("Exam is not existed");
        next()
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function checkExamSubjectId(req, res, next) {
    try {
        let {exam_subject_id} = req.params;
        if (!exam_subject_id) exam_subject_id = req.body.exam_subject_id;
        if (!exam_subject_id) throw new Error("exam_subjects_id params fields is missing");
        const existExamSubject = await db.exam_subjects.findAll({
            where: {
                id: exam_subject_id
            }
        });
        if (!existExamSubject.length) throw new Error("exam_subject_id is not existed");
        req.examOfExamSubject = existExamSubject[0].dataValues.exam_id;
        next()
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function checkSubjectId(req, res, next) {
    try {
        const {subject_id} = req.body;
        if (!subject_id) throw new Error("subject_id fields is missing");

        const existSubject = await db.subjects.findAll({
            where: {
                subject_id
            }
        });
        if (!existSubject.length) throw new Error("subject is not existed");
        next()
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function checkRoomNameExisted(req, res, next) {
    try {
        const {name} = req.body;
        if (!name) throw new Error("name params fields is missing");
        const existName = await db.rooms.findAll({
            where: {
                name
            }
        });
        if (existName.length) throw new Error("room name is existed");
        next();
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function checkRoomIdExisted(req, res, next) {
    try {
        let {room_id} = req.params;
        if (!room_id) room_id = req.body.room_id;
        if (!room_id) throw new Error("room_id params fields is missing");
        const existRoom = await db.rooms.findAll({
            where: {
                id: room_id
            }
        });
        if (!existRoom.length) throw new Error("room is not existed");
        next();
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function checkStartFinishTimeShift(req, res, next) {
    try {
        const {start_time, finish_time} = req.body;
        const {exam_id, shift_id} = req.params;
        if (!start_time
            || !finish_time) throw new Error("start_time or finish_time params is missing");
        if (isNaN(start_time)
            || isNaN(finish_time)) throw new Error("start_time or finish_time params can't NaN");
        if (finish_time <= start_time)
            throw new Error("start_time is later than finish_time");
        let condition = {
            where: {
                start_time: {
                    [Op.or]: [
                        {[Op.between]: [start_time, finish_time]},
                        {[Op.lte]: [start_time]}
                    ]
                },
                finish_time: {
                    [Op.or]: [
                        {[Op.between]: [start_time, finish_time]},
                        {[Op.gte]: [finish_time]}
                    ]
                },
                exam_id
            }
        };
        if (shift_id) {
            condition.where.id = {
                [Op.not]: [shift_id]
            }
        }
        const existedShift = await db.shifts.findAll(condition);
        if (existedShift.length)
            throw new Error("Đã có ca thi trong khung thời gian này");
        next();
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function checkShiftId(req, res, next) {
    try {
        const {shift_id} = req.params;
        if (!shift_id) throw new Error("shift_id params fields is missing");
        const existedShiftId = await db.shifts.findAll({
            where: {
                id: shift_id
            }
        });
        if (!existedShiftId.length) throw new Error("shift_id isn't existed");
        req.examOfShiftId = existedShiftId[0].dataValues.exam_id;
        next()
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    checkExamId,
    checkExamSubjectId,
    checkSubjectId,
    checkRoomNameExisted,
    checkRoomIdExisted,
    checkStartFinishTimeShift,
    checkShiftId
};