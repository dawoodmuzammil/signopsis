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

const usersCollection = db.collection("users"); // get users collection

module.exports = {

    // == == == REGISTER USER == == == //
    async registerUser( req, res, next) {  
        var email = req.body.email;
        var password = req.body.password;      
        
        var registerResult = await firebase.auth().createUserWithEmailAndPassword( email, password);
        var uid = registerResult.user.uid;
        var user = {
            id: uid,
            name: req.body.name,
            email: email,
            dob: req.body.dob
        }
        const docRef = usersCollection.doc(uid).set( user);

        res.redirect("/video-upload");
    },

    // == == == LOG IN USER == == == //
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

    // == == == GET MAIN PAGE == == == //
    async getMainPage( req, res, next) {
        var user = firebase.auth().currentUser;        
        
        if ( user) 
            res.render("main");
        else
            res.redirect("/");
    },    

    // == == == LOG OUT == == == //
    async getLogout( req, res, next) {
        firebase.auth().signOut();
        res.redirect("/");
    }
}