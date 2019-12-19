const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const excelToJson = require("convert-excel-to-json");

async function create(req, res) {
    try {
        const {exam_id} = req.params;
        const {subject_id} = req.body;
        const existExamClasses = await db.exam_subjects.findAll({
            where: {
                exam_id,
                subject_id
            }
        });
        if (existExamClasses.length) throw new Error("Môn thi đã tồn tại trong kì thi");
        await db.exam_subjects.create({
            exam_id,
            subject_id
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
        let exam_subjects = await db.exam_subjects.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {exam_subjects: exam_subjects}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function destroy(req, res) {
    try {
        const {exam_subject_id} = req.params;
        await db.exam_subjects.destroy({
            where: {id: exam_subject_id}
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function update(req, res) {
    try {
        const {exam_subject_id} = req.params;
        const {exam_id, subject_id} = req.body;
        const existExamSubject = await db.exam_subjects.findAll({
            where: {
                exam_id,
                subject_id
            }
        });
        if (existExamSubject.length) throw new Error("Học phần cập nhật đã tồn tại");
        await db.exam_subjects.update({
            exam_id,
            subject_id
        }, {
            where: {
                id: exam_subject_id
            }
        });
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function importStudents(req, res) {
    let Enough_condition_MSSV = [];
    let Not_enough_condition_MSSV = [];
    const {exam_subject_id} = req.params;

    async function checkStudentsExisted(students) {
        try {
            let flagAllStudentExisted = true;
            let studentsNotExisted = [];
            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                const isStudentExist = await db.accounts.findAll({
                    where: {
                        user_name: student
                    }
                });
                if (!isStudentExist.length) {
                    flagAllStudentExisted = false;
                    studentsNotExisted.push(student);
                }
            }
            if (flagAllStudentExisted) return {
                allExisted: true
            };
            else return {
                allExisted: false,
                studentsNotExisted
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async function validateAndFilterColumnInput(studentsJSON) {
        try {
            for (let excelRow = 0; excelRow < studentsJSON.length; excelRow++) {
                const row = studentsJSON[excelRow];
                if (row.Enough_condition_MSSV)
                    Enough_condition_MSSV.push(row.Enough_condition_MSSV);
                if (row.Not_enough_condition_MSSV)
                    Not_enough_condition_MSSV.push(row.Not_enough_condition_MSSV);
            }
            const sameMSSV = Enough_condition_MSSV.filter((mssv) => {
                return Not_enough_condition_MSSV.indexOf(mssv) !== -1;
            });
            Not_enough_condition_MSSV = [...new Set(Not_enough_condition_MSSV)];
            Enough_condition_MSSV = [...new Set(Enough_condition_MSSV)];
            if (sameMSSV.length) throw new Error("2 cột cùng có sinh viên: " + JSON.stringify(sameMSSV));
            const isEnoughConditionStudentsExisted = await checkStudentsExisted(Enough_condition_MSSV);
            const isNotEnoughConditionStudentsExisted = await checkStudentsExisted(Not_enough_condition_MSSV);
            const notEnoughStudents = [];
            if (!isEnoughConditionStudentsExisted.allExisted) {
                notEnoughStudents.push(...isEnoughConditionStudentsExisted.studentsNotExisted);
            }
            if (!isNotEnoughConditionStudentsExisted.allExisted) {
                notEnoughStudents.push(...isNotEnoughConditionStudentsExisted.studentsNotExisted);
            }
            if (notEnoughStudents.length)
                throw new Error("Những sinh viên sau chưa có trong cơ sở dữ liệu: " + JSON.stringify(notEnoughStudents));
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async function saveStudentsToDb(students, isEnoughCondition) {
        try {
            for (let i = 0; i < students.length; i++) {
                const studentInfo = await db.accounts.findOne({
                    where: {
                        user_name: students[i]
                    }
                });
                await db.students.create({
                    exam_subject_id,
                    account_id: studentInfo.dataValues.id,
                    enoughCondition: isEnoughCondition
                })
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    try {
        if (!req.file) throw new Error("File is missing!");
        const filePath = req.file.path;
        let studentsSheetJSON = excelToJson({
            sourceFile: filePath,
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'Enough_condition_MSSV',
                B: 'Not_enough_condition_MSSV',
            }
        });
        const firstSheetName = Object.keys(studentsSheetJSON)[0];
        const studentsJSON = studentsSheetJSON[firstSheetName];
        await validateAndFilterColumnInput(studentsJSON);
        await db.students.destroy({
            where: {
                exam_subject_id
            }
        });
        await saveStudentsToDb(Enough_condition_MSSV, 1);
        await saveStudentsToDb(Not_enough_condition_MSSV, 0);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function getStudentsSubject(req, res) {
    try {
        let {page, pageSize, keywords} = req.query;
        const {exam_subject_id} = req.params;
        if (!page) page = 1;
        if (!pageSize) pageSize = 15;
        const offset = (page - 1) * pageSize;
        const limit = Number(pageSize);
        let conditionQuery = {
            offset,
            limit,
            where: {
                exam_subject_id
            },
            include: {
                model: db.accounts,
                where: [{role_id: 2}],
                attributes: ["user_name", "fullname", "birthday", "email"]
            }
        };
        if (keywords) {
            keywords = "+" + keywords + "*";
            conditionQuery.include.where.push(db.Sequelize.literal('MATCH (user_name) AGAINST (:name IN BOOLEAN MODE)'));
            conditionQuery.replacements = {
                name: keywords
            };
        }
        let studentsExamSubject = await db.students.findAndCountAll(conditionQuery);
        res.json(responseUtil.success({data: {studentsExamSubject}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create,
    getInformation,
    destroy,
    update,
    importStudents,
    getStudentsSubject
};