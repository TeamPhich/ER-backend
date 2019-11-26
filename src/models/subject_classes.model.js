module.exports = (sequelize, Sequelize) => {
    return sequelize.define("subject_classes", {
        class_number: {
            type: Sequelize.STRING
        }
    });
};