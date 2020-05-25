
var db          =   require("../database/config");
var firebase = require("firebase/app");
let admin = require("firebase-admin");
var UserSchema        =   require("../models/users");
var ChatSchema       =   require("../models/chats");

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

const usersCollection = db.collection("users"); // get chats collection
const chatsCollection = db.collection("chats"); // get chats collection
const userChatsCollection = db.collection("userChats"); // get chats collection

module.exports = {
    // /friends/{friendId}/add-friend
    async addFriend( req, res, next) {
        var user = firebase.auth().currentUser;
        var friendId = req.params.friendId;
        
        var senderUser = await UserSchema.findById( user.uid);
        
        // check if friendship already exists
        var exists = senderUser.friends.includes( friendId)
        var friend = await UserSchema.findById( friendId);        

        if ( !exists) {            
            // update chats array for each user
            await senderUser.friends.push( friendId);
            senderUser.save();
            await friend.friends.push( user.uid);
            friend.save();
            res.status(200).send("Friend added successfully.");        
        }
        else {
            res.status(400).send("You arleady have " + friend.name + " added as a friend.");
        }
    },

    // /friends/{friendId}/delete-friend
    async deleteFriend( req, res, next) {

    },

    async getFriendsList( req, res, next) {

    }
}