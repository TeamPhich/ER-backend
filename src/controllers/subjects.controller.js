const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

async function create(req, res) {
    const {subject_id, name, credit} = req.body;
    try {
        if (!subject_id) throw new Error("subject_id is missing");
        if (!name) throw new Error("name field is missing");
        if (!credit) throw new Error("credit field is missing");

        const existedSubject = await db.subjects.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    {subject_id: subject_id},
                    {name: name}
                ]
            }
        });
        if (existedSubject.length) throw new Error("Tên môn học hoặc mã mốn học đã được tồn tại");
        await db.subjects.create({
            subject_id,
            name,
            credit
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getInformation(req, res) {
    try {
        const subjectsInformation = await db.subjects.findAll();
        subjectsInformation.map(subject => {
            return subject.dataValues;
        });
        res.json(responseUtil.success({data: {subjectsInformation}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function deleteSubject(req, res) {
    try {
        const {subject_id} = req.params;
        const existedSubject = await db.subjects.findAll({
            where: {subject_id}
        });
        if (!existedSubject.length) throw new Error("subject is not exist");
        await db.subjects.destroy({
            where: {
                subject_id
            }
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function updateSubject(req, res) {
    try {
        let {subject_id, new_subject_id, name, credit} = req.body;
        if (!subject_id) throw new Error("subject_id fields is missing");
        let updateCondition = {};
        if (new_subject_id) updateCondition.subject_id = new_subject_id;
        if (name) updateCondition.name = name;
        if (credit) updateCondition.credit = credit;
        await db.subjects.update(
            {...updateCondition},{
            where: {
                subject_id
            }
        });
        res.json(responseUtil.success({data: {updateCondition}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    deleteSubject,
    updateSubject
};