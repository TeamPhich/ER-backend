module.exports = (sequelize, Sequelize) => {
    return sequelize.define("students", {
        class_name: {
            type: Sequelize.STRING
        },
        enoughCondition: {
            type: Sequelize.INTEGER
        }
    });
};