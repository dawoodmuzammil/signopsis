var mongoose = require("mongoose");

var ChatSchema = new mongoose.Schema({    
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

module.exports = mongoose.model( "Chat", ChatSchema);
