const express = require('express');
const router = express.Router();
const Notifications = require('../controllers/NotificationController');


router.get('/getnotifications', Notifications.getNotifications);
router.post('/markread', Notifications.markRead);

module.exports = router;