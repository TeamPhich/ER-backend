const db = require("../models/index");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const responseUtil = require("../utils/responses.util");
const validator = require("email-validator");

async function login(req, res) {
    const {
        user_name,
        password
    } = req.body;

    try {
        if (!user_name) throw new Error("user_name field is missing");
        if (!password) throw new Error("password field is missing");

        let [userData] = await db.accounts.findAll({
            where: {
                user_name: user_name
            },
            include: [db.roles]
        });

        if (!userData) throw new Error("user_name or password is incorrect");

        let user = userData.dataValues;
        const hashPassword = user.password;
        const isAdmin = user.role.dataValues.name === "admin";
        const checkPass = bcrypt.compareSync(password, hashPassword);

        if (!checkPass) throw new Error("user_name or password is incorrect");

        const twentyFourHours = 24 * 60 * 60 * 30;

        const token = jwt.sign({
                id: user.id,
                email: user.email
            },
            config.get('SECRET_KEY'), {
                expiresIn: twentyFourHours
            }
        );

        res.json(responseUtil.success({data: {token, isAdmin}}));

    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

async function register(req, res) {
    const {
        user_name,
        password,
        email,
        fullname,
        birthday,
        role_id
    } = req.body;
    try {
        if (user_name.length < 8) throw new Error("user_name must greater than 8 characters");
        if (password.length < 8) throw new Error("password must greater than 8 characters");
        if (!fullname) throw new Error("fullname field is missing");
        if (!birthday) throw new Error("birthday field is missing");
        if (!validator.validate(email)) throw new Error("email wrong standard");

        const user = await db.accounts.findAll({
            where: {
                user_name
            }
        });
        if (user.length) throw new Error("user_name existed");
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        await db.accounts.create({
            user_name,
            password: hashPassword,
            email,
            fullname,
            birthday,
            role_id
        });

        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getInformation(req, res) {
    const {id} = req.tokenData;
    try {
        const accountProfile = await db.accounts.findOne({
            where: {
                id
            },
            attributes: ["fullname", "birthday", "email", "user_name"]
        });
        res.json(responseUtil.success({data: accountProfile}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function updateProfile(req, res) {
    try {
        const {id} = req.tokenData;
        const {fullname, birthday, email} = req.body;
        if (!validator.validate(email)) throw new Error("email sai định dạng.");
        const emailExisted = await db.accounts.findAll({
            where: {
                email,
                id: {
                    [db.Sequelize.Op.not]: [id]
                }
            }
        });
        if (emailExisted.length) throw new Error("email đã tồn tại");
        await db.accounts.update({
            fullname,
            birthday,
            email
        }, {
            where: {
                id
            }
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function changePassword(req, res) {
    try {
        const {oldPassword, newPassword} = req.body;
        const {id} = req.tokenData;
        if (!oldPassword) throw new Error("oldPassword field is missing");
        if (!newPassword) throw new Error("newPassword field is missing");

        let [userData] = await db.accounts.findAll({
            where: {
                id
            }
        });

        if (!userData) throw new Error("user_name or password is incorrect");

        let user = userData.dataValues;
        const hashOldPassword = user.password;
        const checkPass = bcrypt.compareSync(oldPassword, hashOldPassword);
        if (!checkPass) throw new Error("oldPassword is incorrect");
        let salt = await bcrypt.genSalt(10);
        let hashNewPassword = await bcrypt.hash(newPassword, salt);
        await db.accounts.update({
            password: hashNewPassword
        }, {
            where: {id}
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function resetPassword(req, res) {
    try {
        const {mssv} = req.params;
        if (!mssv) throw new Error("mssv params is missing");
        const userData = await db.accounts.findAll({
            user_name: mssv
        });
        if (!userData.length) throw new Error("user isn't existed");
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(mssv, salt);
        await db.accounts.update({
            password: hashPassword
        }, {
            where: {user_name: mssv}
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

module.exports = {
    login,
    register,
    getInformation,
    updateProfile,
    changePassword,
    resetPassword
};