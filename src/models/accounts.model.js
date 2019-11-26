module.exports = (sequelize, Sequelize) => {
    return sequelize.define("accounts", {
        user_name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        birthday: {
            type: Sequelize.DATE
        },
        fullname: {
            type: Sequelize.STRING
        }
    });
};