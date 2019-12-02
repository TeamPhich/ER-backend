const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const csv = require("csvtojson");
const bcrypt = require("bcrypt");

async function importStudents(req, res) {
    try {
        if (!req.file) throw new Error("File is missing!");
        const studentsJSON = await csv().fromFile(req.file.path);
        studentsJSON.map(student => {
            student.birthday = new Date(student.birthday).getTime()/1000;
        });
        let existedStudents = [];
        for (let student of studentsJSON) {
            const existedStudent = await db.accounts.findAll({
                where: {
                    user_name: student.MSSV
                }
            });
            if (existedStudent.length) existedStudents.push({MSSV: student.MSSV})
        }
        if (existedStudents.length) throw new Error(JSON.stringify({message: "student existed", existedStudents}));
        for (let student of studentsJSON) {
            let salt = await bcrypt.genSalt(10);
            let {MSSV,fullname,birthday} = student;
            let hashPassword = await bcrypt.hash(MSSV, salt);
            await db.accounts.create({
                user_name: MSSV,
                password: hashPassword,
                fullname,
                birthday: birthday,
                role_id: 2
            });
        }
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

module.exports = {
    importStudents
};