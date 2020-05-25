var mongoose = require("mongoose");

var ChatSchema = new mongoose.Schema({    
    // _id: String,
    members: [
        {
            type: String,
            ref: "User"
        }
    ],
    createdAt: Date
})

module.exports = mongoose.model( "Chat", ChatSchema);
