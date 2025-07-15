const upload = require('../upload/upload');
const express = require('express');
const router = express.Router();
const Uploaddoc = require('../controllers/Documentcontroller');


router.post('/upload', upload, Uploaddoc.uploadDocument);

router.get('/documentsbyapplication/:applicationId', Uploaddoc.documentsByApplication)
router.get('/:id/view', Uploaddoc.documentsbyId )
module.exports = router;