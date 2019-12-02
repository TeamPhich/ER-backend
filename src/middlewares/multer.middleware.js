const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});


const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname);
    if (extension === '.csv')
        cb(null, true);
    else cb(new Error('file is not image'), false);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

module.exports = {
    upload
};