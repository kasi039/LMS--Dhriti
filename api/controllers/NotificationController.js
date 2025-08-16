const Notification = require('../models/Notifications');


exports.getNotifications = async(req, res) => {
    const notifications = await Notification.find({userId: req.session.user?.id, read: false});
    res.json(notifications);
}

exports.markRead = async(req, res) => {
    await Notification.updateMany(
        {_id: {$in: req.body.ids}, userId: req.session.user?.id },
        {$set: {read: true}}
    );
    res.json({success: true});

}