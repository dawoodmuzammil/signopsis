var express = require('express');
var router = express.Router();
multer = require('multer');
const upload = multer({
    'dest': 'uploads/'
});

const { asyncErrorHandler } =    require('../middleware/index');
const { postVideo } = require("../controllers/index");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
    res.render('register');
});

/* GET video-upload page. */
router.post("/upload-video", upload.single('pic-to-be-sent'), asyncErrorHandler(postVideo));

module.exports = router;
