const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

async function create(req, res) {
    try {
        const {exam_id, subject_id} = req.params;
        if (!exam_id || !subject_id) throw new Error("Exam_id or subject_id params fields is missing");
        const {class_number} = req.body;
        if (!class_number) throw new Error("class_number body fields is missing");
        const existSubjectClasses = await db.subject_classes.findAll({
            where: {
                class_number,
                exam_id,
                subject_id
            }
        });
        if (existSubjectClasses.length) throw new Error("Học phần đã tồn tại trong kì thi");
        await db.subject_classes.create({
            exam_id,
            subject_id,
            class_number
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getInformation(req, res) {
    try {
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
        let subject_classes = await db.subject_classes.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {subject_classes: subject_classes}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function destroy(req, res) {
    try {
        const {subject_classes_id} = req.params;
        if (!subject_classes_id) throw new Error("subject_classes_id params fields is missing");
        await db.subject_classes.destroy({
            where: {id: subject_classes_id}
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function update(req, res) {
    try {
        const {subject_classes_id} = req.params;
        const {class_number, exam_id, subject_id} = req.body;
        if (!class_number || !exam_id || !subject_id) throw new Error("body params is missing some fields");
        const existSubjectClass = await db.subject_classes.findAll({
            where: {
                class_number,
                exam_id,
                subject_id
            }
        });
        if (existSubjectClass.length) throw new Error("Học phần cập nhật đã tồn tại");
        await db.subject_classes.update({
            class_number,
            exam_id,
            subject_id
        }, {
            where: {
                id: subject_classes_id
            }
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    destroy,
    update
};