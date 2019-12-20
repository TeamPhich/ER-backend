const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const Op = db.Sequelize.Op;

async function create(req, res) {
    const {id, name} = req.body;
    try {
        if (!id) throw new Error("id fields is missing");
        if (!name) throw new Error("name field is missing");
        const existExam = await db.exams.findAll({
            where: {
                id: id
            }
        });
        if (existExam.length) throw new Error("Mã kì thi đã tồn tại!");
        await db.exams.create({
            id,
            name
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getInformation(req, res) {
    try {
        let {page, pageSize, keywords} = req.query;
        const isGetAll = "-1";
        if (!page) page = 1;
        if (!pageSize) pageSize = 15;
        const offset = (page - 1) * pageSize;
        const limit = Number(pageSize);
        let conditionQuery = {
            offset,
            limit
        };
        if(page === isGetAll) {
            conditionQuery = {};
        }
        if (keywords) {
            keywords = keywords + "%";
            conditionQuery.replacements = {
                name: keywords
            };
            if (!req.query && page !== -1) conditionQuery.limit = 5;
            conditionQuery.where = {
                id: {[Op.like]: keywords}
            };
        }
        let exams = await db.exams.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {exams}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function updateInformation(req, res) {
    try {
        const {id, new_id, new_name} = req.body;
        const updateCondition = {};
        if (!id) throw new Error("id field is missing");
        if (new_id) {
            const existId = await db.exams.findAll({
                where: {
                    [Op.and]: [{id: new_id}, {[Op.not]: {id: id}}]
                }
            });
            if (existId.length) throw new Error("Mã sinh viên đã tồn tại.");
            updateCondition.id = new_id;
        }

        if (new_name) {
            updateCondition.name = new_name;
        }
        await db.exams.update(
            {...updateCondition},
            {
                where: {
                    id: id
                }
            }
        );
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function deleteExams(req, res) {
    try {
        const {exam_id} = req.params;
        if (!exam_id) throw new Error("exam_id params is missing");
        const existExam = await db.exams.findAll({
            where: {
                id: exam_id
            }
        });
        if (!existExam.length) throw new Error("exam isn't exist");
        await db.exams.destroy({
            where: {
                id: exam_id
            }
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    updateInformation,
    deleteExams
};