module.exports = (sequelize, Sequelize) => {
    return sequelize.define("shifts_rooms", {
        current_slot: {
            type: Sequelize.INTEGER
        }
    });
};