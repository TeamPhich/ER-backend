const db = require("../models/index");
const deleteDBUtil = require("../utils/deleteDB.util");
const responseUtil = require("../utils/responses.util");
const Op = db.Sequelize.Op;

async function create(req, res) {
    try {
        const {start_time, finish_time} = req.body;
        const {exam_id} = req.params;
        await db.shifts.create({
            start_time,
            finish_time,
            exam_id
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getInformation(req, res) {
    try {
        let {page, pageSize, sortColumn, sortType} = req.query;
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
            }
        };
        if (sortColumn && sortType) {
            conditionQuery.order = [[sortColumn, sortType]]
        }
        const shifts = await db.shifts.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {shifts}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function updateInformation(req, res) {
    try {
        const {shift_id} = req.params;
        const {start_time, finish_time} = req.body;
        if (!shift_id)
            throw new Error("shift_id params fields is missing");
        const shiftExisted = await db.shifts.findAll({
            where: {
                id: shift_id
            }
        });
        if (!shiftExisted.length) throw new Error("shift isn't existed");
        await db.shifts.update({
            start_time,
            finish_time
        }, {
            where: {
                id: shift_id
            }
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function deleteShift(req, res) {
    try {
        const {shift_id} = req.params;
        if (!shift_id)
            throw new Error("shift_id params fields is missing");
        const shiftExisted = await db.shifts.findAll({
            where: {
                id: shift_id
            }
        });
        await deleteDBUtil.deleteShift(shift_id);
        if (!shiftExisted.length) throw new Error("shift isn't existed");

        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    updateInformation,
    deleteShift
};