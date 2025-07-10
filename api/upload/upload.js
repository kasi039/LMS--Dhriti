const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

const documentUpload = upload.fields([
  { name: 'governmentId', maxCount: 1 },
  { name: 'studyCertificate', maxCount: 1 },
  { name: 'collegeAcceptanceLetter', maxCount: 1 },
  { name: 'carCertificate', maxCount: 1 },
  { name: 'drivingLicense', maxCount: 1 },
  { name: 'homeCertificate', maxCount: 1 },
  { name: 'permissionLetter', maxCount: 1 }
]);

module.exports = documentUpload;
