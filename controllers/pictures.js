var cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'dfifvbzoq',
    api_key: '465132132992649',
    api_secret: process.env.CLOUDINARY_URL
});

module.exports = {
    async postPicture( req, res, next) {        
        var image = await cloudinary.v2.uploader.upload(req.file.path,
            { resource_type: "video" }); // upload it on cloudinary
        // get info from cloudinary to be saved in the database
        var image = {
            url: image.secure_url,
            public_id: image.public_id
        };	        
        console.log(image);
        res.send("POST /post");
    }
}