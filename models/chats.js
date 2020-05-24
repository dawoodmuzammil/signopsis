var mongoose = require("mongoose");

var ChatSchema = new mongoose.Schema({    
    _id: String,
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

module.exports = mongoose.model( "Chat", ChatSchema);
