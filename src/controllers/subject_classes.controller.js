const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

async function createClass(req, res) {
    try {
        const {exam_id, subject_id} = req.params;
        if(!exam_id || !subject_id) throw new Error("Exam_id or subject_id params fields is missing");
        const {class_number} = req.body;
        if(!class_number) throw new Error("class_number body fields is missing");
        await db.subject_classes.create({
           exam_id,
           subject_id,
           class_number
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    createClass
};