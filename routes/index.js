var express = require('express');
var router = express.Router();

const { asyncErrorHandler } =    require('../middleware/index');
const { postPicture } = require("../controllers/pictures");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/post", postPicture);

module.exports = router;
