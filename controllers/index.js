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
const userChatsCollection = db.collection("userChats");

module.exports = {

    // == == == REGISTER USER == == == //
    async registerUser( req, res, next) {  
        var email = req.body.email;
        var password = req.body.password;      
        
        // register user
        var registerResult = await firebase.auth().createUserWithEmailAndPassword( email, password);
        
        var user = firebase.auth().currentUser;
        await user.updateProfile({
            displayName: req.body.name
        })
        
        sendVerificationEmail();
        
        var uid = user.uid;
        
        var userDetails = {
            id: uid,
            name: req.body.name,
            email: email
            // dob: req.body.dob
        } 
        
        // add user info in users collection
        const docRef = await usersCollection.doc(uid).set( userDetails);

        // add user in userChatsCollection
        let userChatsObj = {
            chats: []
        }
        const chatRef = await userChatsCollection.doc(uid).set( userChatsObj);

        res.send( user);
    },

    // == == == LOG IN USER == == == //
    async signInUser( req, res, next ) {
        var user = firebase.auth().currentUser;
        
        if ( !user) {
            var email = req.body.email;
            var password = req.body.password;

            // sign user in: if login fails, send error message as response
            user = await firebase.auth().signInWithEmailAndPassword( email, password)
                            .catch( function( error) {
                                res.send( error.message);
                            });
        }
        // login successful: send user object as response
        res.send( user);        
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
    },

    // == == == UPDATE NAME == == == //
    async updateUserDisplayName( req, res, next) {
        var user = firebase.auth().currentUser;

        await user.updateProfile({
            displayName: req.body.displayName,            
        }).catch( function( error) {
            res.status(500).send(error.message);
        })

        res.send( user);

    },

    // == == == UPDATE EMAIL == == == //
    async updateUserEmail( req, res, next) {
        var user = firebase.auth().currentUser;
        var newEmail = req.body.email;

        user.updateEmail(newEmail).then(function() {
            sendVerificationEmail();
            res.status(200).send( user);
        }).catch(function(error) {
            res.status(500).send(error.message);            
        });        
    },

    // == == == UPDATE PASSWORD == == == //
    async updateUserPassword( req, res, next) {
        var user = firebase.auth().currentUser;
        var newPassword = req.body.password;
        
        user.updatePassword(newPassword).then(function() {          
            res.send( user);
        }).catch(function(error) {
            res.send( error.message);
        });        
    },

    // == == == RESET PASSWORD == == == //
    async resetPassword( req, res, next) {
        var auth = firebase.auth();
        var emailAddress = req.body.email;
        var str = "A password reset email has been sent at ";
        str = str.concat( emailAddress);

        await auth.sendPasswordResetEmail(emailAddress).then(function() {
            res.status(200).send( str);
        }).catch(function(error) {
            res.status(500).send(error.message);            
        });
    },

    // == == == RESET PASSWORD == == == //
    async deleteAccount( req, res, next) {

    }

    // == == == UPDATE PASSWORD == == == //
}

async function sendVerificationEmail() {
    var user = firebase.auth().currentUser;

    // send verification email to logged in user
    await user.sendEmailVerification()
        .catch(function(error) {
            res.send( error.message); // send error message            
        });
}