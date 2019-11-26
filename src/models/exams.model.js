module.exports = (sequelize, Sequelize) => {
    return sequelize.define("exams", {
        name: {
            type: Sequelize.STRING
        }
    });
};