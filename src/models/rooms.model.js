module.exports = (sequelize, Sequelize) => {
    return sequelize.define("rooms", {
        name: {
            type: Sequelize.STRING
        },
        slot: {
            type: Sequelize.INTEGER
        }
    },{
        indexes: [
            { type: 'FULLTEXT', name: 'room_idx', fields: ['name'] }
        ]
    });
};