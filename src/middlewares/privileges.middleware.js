const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

function verify(privilege_id) {
    return async (req, res, next) => {
        try {
            const {id} = req.tokenData;
            const [userInformation] = await db.accounts.findAll({
                where: {
                    id: id
                }
            });
            const role_id = userInformation.dataValues.role_id;
            const [hasPermission] = await db.roles_privileges.findAll({
                where: {
                    role_id,
                    privilege_id
                }
            });
            if (!hasPermission) throw new Error("You haven't been granted privilege for this function");
            next();
        } catch (err) {
            res.json(responseUtil.fail({reason: err.message}))
        }
    }
}

module.exports = {
    verify
};
