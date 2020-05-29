var express = require('express');
var router = express.Router();
multer = require('multer');

const upload = multer({
    'dest': 'uploads/'
});

const { asyncErrorHandler } =    require('../middleware/index');
const { getAllChats, postVideo, postSendMessage } = require("../controllers/chats");

router.get('/', asyncErrorHandler( getAllChats));

// ================ VIDEO ================ //
/* GET video-upload page. */
router.post("/upload-video", upload.single('pic-to-be-sent'), asyncErrorHandler(postVideo));

// ================ MESSAGE ================ //
router.post('/:receiverId/sendMessage', asyncErrorHandler(postSendMessage));

module.exports = router;
