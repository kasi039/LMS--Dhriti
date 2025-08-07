const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

const documentUpload = upload.any(); 

module.exports = documentUpload;
