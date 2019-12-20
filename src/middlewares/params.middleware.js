const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const excelToJson = require("convert-excel-to-json");

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
        const {exam_subject_id} = req.params;
        if (!exam_subject_id) throw new Error("exam_subjects_id params fields is missing");
        const existExamSubject = await db.exam_subjects.findAll({
            where: {
                id: exam_subject_id
            }
        });
        if (!existExamSubject.length) throw new Error("exam_subject_id is not existed");
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
        const {room_id} = req.params;
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

module.exports = {
    checkExamId,
    checkExamSubjectId,
    checkSubjectId,
    checkRoomNameExisted,
    checkRoomIdExisted
};