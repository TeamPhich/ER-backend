module.exports = (sequelize, Sequelize) => {
    return sequelize.define("rooms", {
        name: {
            type: Sequelize.STRING
        },
        slot: {
            type: Sequelize.INTEGER
        }
    });
};