var mongoose                = require("mongoose");

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,    
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

module.exports = mongoose.model( "User", UserSchema);
