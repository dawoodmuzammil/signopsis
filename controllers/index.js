var cloudinary  =   require("cloudinary");
var db          =   require("../database/config");
var firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDrEvs8_D1oHKYxIhIT4NrZ_epC5zgP7H0",
    authDomain: "node-signchat.firebaseapp.com",
    databaseURL: "https://node-signchat.firebaseio.com",
    projectId: "node-signchat",
    storageBucket: "node-signchat.appspot.com",
    messagingSenderId: "488700115819",
    appId: "1:488700115819:web:43a2a620cb4087871daa2e",
    measurementId: "G-0TZEWYT8MS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth.Auth.Persistence.LOCAL;

cloudinary.config({
    cloud_name: 'dfifvbzoq',
    api_key: '465132132992649',
    api_secret: process.env.CLOUDINARY_URL
});

const chatsCollection = db.collection("chats"); // get chats collection

module.exports = {
    async registerUser( req, res, next) {  
        var email = req.body.email;
        var password = req.body.password;      
        const usersCollection = db.collection("users"); // get users collection

        var registerResult = await firebase.auth().createUserWithEmailAndPassword( email, password);
        var uid = registerResult.user.uid;
        var user = {
            name: req.body.name,
            dob: req.body.dob
        }
        const docRef = usersCollection.doc(uid).set( user);

        res.redirect("/video-upload");
    },

    async signInUser( req, res, next ) {
        var user = firebase.auth().currentUser;

        if ( !user) {
            var email = req.body.email;
            var password = req.body.password;

            var signInResult = await firebase.auth().signInWithEmailAndPassword( email, password);
            res.redirect("/video-upload");
        }
        else {
            res.redirect("/video-upload");
        }
    },

    async getMainPage( req, res, next) {
        var user = firebase.auth().currentUser;        
        
        if ( user) 
            res.render("main");
        else
            res.redirect("/");
    },

    async postVideo( req, res, next) {        
        var user = firebase.auth().currentUser;
        
        if ( user) {
            var image = await cloudinary.v2.uploader.upload(req.file.path,
                { resource_type: "video" }); // upload it on cloudinary
            // get info from cloudinary to be saved in the database
            var chatObj = {
                sender: user.email,
                receiver: "receiver@gmail.com",
                timestamp: new Date(),
                url: image.secure_url,
                public_id: image.public_id
            };	        

            // const docRef = chatsCollection.doc("pictureRef");
            let addChatObj = chatsCollection.add( chatObj);

            console.log(chatObj);
            res.send(chatObj.url);
        }
        else {
            res.redirect("/");
        }
    },

    async getLogout( req, res, next) {
        firebase.auth().signOut();
        res.redirect("/");
    }
}