const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

async function create(req,res) {
    const {id, name} = req.body;
    try {
        if(!id) throw new Error("id fields is missing");
        if(!name) throw new Error("name field is missing");
        const existExam = await db.exams.findAll({
            where: {
                id: id
            }
        });
        if(existExam.length) throw new Error("Mã kì thi đã tồn tại!");
        await db.exams.create({
            id,
            name
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getInformation(req,res) {
    try {

        let exams = await db.exams.findAll();
        exams.map(exam => {
            return exam.dataValues
        });
        res.json(responseUtil.success({data: {exams}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation
};