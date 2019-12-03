module.exports = (sequelize, Sequelize) => {
    return sequelize.define("subjects", {
        subject_id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        credit: {
            type: Sequelize.INTEGER
        }
    });
};