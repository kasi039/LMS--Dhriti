// api/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/Usercontroller');


router.post('/signup', userController.signup);

router.post('/login', userController.login);


router.get('/session-user', userController.session);



// Get all user accounts
router.get('/alluseraccounts', userController.alluseraccounts);


// Delete User
router.delete('/:id', userController.deleteuser);


// Get a user by ID
router.get('/:id', userController.singleuser);



// Update User

router.put('/update/:id', userController.updateuser); 


router.post('/logout', userController.logout);




module.exports = router;
