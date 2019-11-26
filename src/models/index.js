const Sequelize = require('sequelize');
const config = require("config");

const db_info = config.get("database");
const db = {};

const sequelize = new Sequelize(
    db_info.name,
    db_info.user,
    db_info.password, {
        host: db_info.host,
        port: db_info.port,
        dialect: 'mysql',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 1000000,
            idle: 200000,
        },
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false,
            freezeTableName: true
        },
        logging: false
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.accounts = require("./accounts.model")(sequelize, Sequelize);
db.roles = require("./roles.model")(sequelize, Sequelize);
db.privileges = require("./privileges.model")(sequelize, Sequelize);
db.roles_privileges = require("./roles_privileges.model")(sequelize, Sequelize);
db.subjects = require("./subjects.model")(sequelize, Sequelize);
db.exams = require("./exams.model")(sequelize, Sequelize);
db.subject_classes = require("./subject_classes.model")(sequelize,Sequelize);
db.students = require("./students.model")(sequelize, Sequelize);
db.shifts_exams = require("./shifts.model")(sequelize, Sequelize);
db.rooms = require("./rooms.model")(sequelize, Sequelize);
db.shift_room = require("./shifts_rooms.model")(sequelize, Sequelize);

db.accounts.belongsTo(db.roles, {
    foreignKey: "role_id",
    sourceKey: "id"
});

db.roles_privileges.belongsTo(db.privileges, {
    foreignKey: "privilege_id",
    sourceKey: "id"
});

db.roles_privileges.belongsTo(db.roles, {
    foreignKey: "role_id",
    sourceKey: "id"
});

db.subject_classes.belongsTo(db.exams, {
    foreignKey: "exam_id",
    sourceKey: "id"
});

db.subject_classes.belongsTo(db.subjects, {
    foreignKey: "subject_id",
    sourceKey: "id"
});

db.students.belongsTo(db.subject_classes, {
    foreignKey: "subject_class_id",
    sourceKey: "id"
});

db.students.belongsTo(db.accounts, {
    foreignKey: "account_id",
    sourceKey: "id"
});

db.shift_room.belongsTo(db.rooms, {
    foreignKey: "room_id",
    sourceKey: "id"
});

db.shift_room.belongsTo(db.shifts_exams, {
    foreignKey: "shift_id",
    sourceKey: "id"
});

db.shift_room.belongsTo(db.exams, {
    foreignKey: "exam_id",
    sourceKey: "id"
});

module.exports = db;
