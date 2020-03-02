module.exports = (sequelize, Sequelize) => {
    return sequelize.define("privileges", {
        name: {
            type: Sequelize.STRING
        }
    });
};