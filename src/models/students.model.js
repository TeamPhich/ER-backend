module.exports = (sequelize, Sequelize) => {
    return sequelize.define("students", {
        enoughCondition: {
            type: Sequelize.INTEGER
        }
    });
};