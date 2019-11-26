module.exports = (sequelize, Sequelize) => {
    return sequelize.define("subjects", {
        name: {
            type: Sequelize.STRING
        },
        credit: {
            type: Sequelize.INTEGER
        }
    });
};