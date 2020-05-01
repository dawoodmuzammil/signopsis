var express = require('express');
var router = express.Router();

const { asyncErrorHandler } =    require('../middleware/index');
const { signInUser, registerUser, getMainPage, postVideo, getLogout } = require("../controllers/index");

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

module.exports = router;
