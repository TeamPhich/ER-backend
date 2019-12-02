module.exports = (sequelize, Sequelize) => {
    return sequelize.define("accounts", {
        user_name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        birthday: {
            type: Sequelize.INTEGER(15)
        },
        fullname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        }
    });
};