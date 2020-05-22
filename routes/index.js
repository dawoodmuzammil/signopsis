var express = require('express');
var router = express.Router();

const { asyncErrorHandler } =    require('../middleware/index');
const { 
    signInUser, 
    registerUser, 
    getMainPage, 
    postVideo, 
    getLogout, 
    resetPassword, 
    deleteAccount,
    updateUserDisplayName,
    updateUserEmail,
    updateUserPassword
} = require("../controllers/index");

// ================================================= //
// ================= AUTHENTICATION ================ //
// ================================================= //

// ================ LOGIN ================ //
/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* POST login page. */
router.post('/login', asyncErrorHandler(signInUser));

// ================ REGISTER ================ //
/* GET register page. */
router.get('/register', function(req, res, next) {
    res.render('register');
});

/* POST register page. */
router.post('/register', asyncErrorHandler(registerUser));

// ================ GET MAIN PAGE ================ //
/* GET video-upload page. */
router.get('/video-upload', asyncErrorHandler(getMainPage));

// ================ LOG OUT ================ //
router.get("/logout", asyncErrorHandler( getLogout));


// ================================================= //
// ================== USER UPDATES ================= //
// ================================================= //

// ================ UPDATE NAME OF USER ================ //
router.post('/update-name', asyncErrorHandler( updateUserDisplayName));

// ================ UPDATE USER EMAIL ================ //
router.post('/update-email', asyncErrorHandler( updateUserEmail));

// ================ UPDATE USER PASSWORD ================ //
router.post('/update-password', asyncErrorHandler( updateUserPassword));

// ================ PASSWORD RESET ================ //
router.post('/reset-password', asyncErrorHandler( resetPassword));

// ================ DELETE ACCOUNT ================ //
router.get('/delete-account', asyncErrorHandler( deleteAccount));




module.exports = router;
