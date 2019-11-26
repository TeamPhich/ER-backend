module.exports = (sequelize, Sequelize) => {
    return sequelize.define("shifts", {
        start_time: {
            type: Sequelize.INTEGER
        },
        finish_time: {
            type: Sequelize.INTEGER
        }
    });
};