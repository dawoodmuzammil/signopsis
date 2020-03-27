var cloudinary  =   require("cloudinary");
var db          =   require("../database/config");
var moment      =   require("moment");


cloudinary.config({
    cloud_name: 'dfifvbzoq',
    api_key: '465132132992649',
    api_secret: process.env.CLOUDINARY_URL
});

const chatsCollection = db.collection("chats"); // get chats collection

module.exports = {
    async postPicture( req, res, next) {        
        var image = await cloudinary.v2.uploader.upload(req.file.path,
            { resource_type: "video" }); // upload it on cloudinary
        // get info from cloudinary to be saved in the database
        var chatObj = {
            sender: "sender@gmail.com",
            receiver: "receiver@gmail.com",
            timestamp: new Date(),
            url: image.secure_url,
            public_id: image.public_id
        };	        
        // const docRef = chatsCollection.doc("pictureRef");
        let addChatObj = chatsCollection.add( chatObj);

        console.log(chatObj);
        res.send("POST /post");
    }
}