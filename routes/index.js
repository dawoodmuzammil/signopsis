var express = require('express');
var router = express.Router();
multer = require('multer');
const upload = multer({
    'dest': 'uploads/'
});

const { asyncErrorHandler } =    require('../middleware/index');
const { postPicture } = require("../controllers/pictures");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/upload-image", upload.single('pic-to-be-sent'), asyncErrorHandler(postPicture));

module.exports = router;
