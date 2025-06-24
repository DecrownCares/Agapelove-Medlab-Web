const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`) // Set the file name
      }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
       const fileTypes = /jpeg|jpg|png|gif|webp|jfif/;
       const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
       const mimeType = fileTypes.test(file.mimetype);

       if(extName && mimeType) {
           return callback(null, true);
       } else {
           callback('Error: Images Only!');
       }
    },
    limits: {
        fileSize: 1024 * 1024 * 50
    }
});

module.exports = upload;