module.exports = (sequelize, Sequelize) => {
    return sequelize.define("exams", {
        name: {
            type: Sequelize.STRING
        },
        start_time: {
            type: Sequelize.INTEGER
        },
        finish_time: {
            type: Sequelize.INTEGER
        }
    });
};