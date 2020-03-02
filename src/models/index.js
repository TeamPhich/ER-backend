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
db.exam_subjects = require("./exam-subjects.model")(sequelize, Sequelize);
db.students = require("./students.model")(sequelize, Sequelize);
db.shifts = require("./shifts.model")(sequelize, Sequelize);
db.rooms = require("./rooms.model")(sequelize, Sequelize);
db.shift_room = require("./shifts_rooms.model")(sequelize, Sequelize);
//roles
db.roles.hasMany(db.accounts, {
    foreignKey: "role_id",
    sourceKey: "id"
});

db.roles.hasMany(db.roles_privileges, {
    foreignKey: "role_id",
    sourceKey: "id"
});

//privileges
db.privileges.hasMany(db.roles_privileges, {
    foreignKey: "privilege_id",
    sourceKey: "id"
});

//accounts
db.accounts.belongsTo(db.roles, {
    foreignKey: "role_id",
    sourceKey: "id"
});

db.accounts.hasMany(db.students, {
    foreignKey: "account_id",
    sourceKey: "id",
});

//role_privileges
db.roles_privileges.belongsTo(db.privileges, {
    foreignKey: "privilege_id",
    sourceKey: "id"
});

db.roles_privileges.belongsTo(db.roles, {
    foreignKey: "role_id",
    sourceKey: "id"
});

//exams
db.exams.hasMany(db.exam_subjects, {
    foreignKey: "exam_id",
    sourceKey: "id"
});

db.exams.hasMany(db.shifts, {
    foreignKey: "exam_id",
    sourceKey: "id"
});

//subjects
db.subjects.hasMany(db.exam_subjects, {
    foreignKey: "subject_id",
    sourceKey: "subject_id"
});

//exam_subjects
db.exam_subjects.belongsTo(db.exams, {
    foreignKey: "exam_id",
    sourceKey: "id"
});

db.exam_subjects.belongsTo(db.subjects, {
    foreignKey: "subject_id",
    sourceKey: "id"
});

db.exam_subjects.hasMany(db.students, {
    foreignKey: "exam_subject_id",
    sourceKey: "id"
});

db.exam_subjects.hasMany(db.shift_room, {
    foreignKey: "exam_subject_id",
    sourceKey: "id"
});

//students
db.students.belongsTo(db.exam_subjects, {
    foreignKey: "exam_subject_id",
    sourceKey: "id"
});

db.students.belongsTo(db.accounts, {
    foreignKey: "account_id",
    sourceKey: "id"
});

db.students.belongsTo(db.shift_room, {
    foreignKey: "shift_room",
    sourceKey: "id"
});

//shifts
db.shifts.belongsTo(db.exams, {
    foreignKey: "exam_id",
    sourceKey: "id"
});

db.shifts.hasMany(db.shift_room, {
    foreignKey: "shift_id",
    sourceKey: "id"
});

//rooms
db.rooms.hasMany(db.shift_room, {
    foreignKey: "room_id",
    sourceKey: "id"
});

//shifts_rooms
db.shift_room.hasMany(db.students, {
    foreignKey: "shift_room",
    sourceKey: "id"
});

db.shift_room.belongsTo(db.rooms, {
    foreignKey: "room_id",
    sourceKey: "id"
});

db.shift_room.belongsTo(db.shifts, {
    foreignKey: "shift_id",
    sourceKey: "id"
});

db.shift_room.belongsTo(db.exam_subjects, {
    foreignKey: "exam_subject_id",
    sourceKey: "id"
});

module.exports = db;
