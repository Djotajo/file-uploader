// const path = require("path");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", "uploads"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

module.exports = upload;
