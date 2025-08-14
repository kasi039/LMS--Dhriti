const multer = require('multer');
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

const documentUpload = upload.any(); 

module.exports = documentUpload;
