const db = require("../models/index");
const deleteDBUtil = require("../utils/deleteDB.util");
const responseUtil = require("../utils/responses.util");
const Op = db.Sequelize.Op;

async function create(req, res) {
    try {
        const {start_time, finish_time} = req.body;
        const {exam_id} = req.params;
        if (!start_time
            || !finish_time) throw new Error("start_time or finish_time params is missing");
        if (isNaN(start_time)
            || isNaN(finish_time)) throw new Error("start_time or finish_time params can't NaN");
        if (finish_time <= start_time)
            throw new Error("start_time is later than finish_time");
        const existedShift = await db.shifts.findAll({
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
        });
        if (existedShift.length)
            throw new Error("Đã có ca thi trong khung thời gian này");
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
        if(sortColumn && sortType) {
            conditionQuery.order = [[sortColumn,sortType]]
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
        if(!shift_id)
            throw new Error("shift_id params fields is missing");
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function deleteShift(req, res) {
    try {

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