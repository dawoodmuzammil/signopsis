var express = require('express');
var router = express.Router();

const { asyncErrorHandler } =    require('../middleware/index');
const { 
    addFriend,
    deleteFriend,
    getFriendsList
} = require("../controllers/friends");

router.get("/:friendId/add-friend", asyncErrorHandler(addFriend));

router.get("/:friendId/delete-friend", asyncErrorHandler(deleteFriend));

router.get("/", asyncErrorHandler(getFriendsList));



module.exports = router;