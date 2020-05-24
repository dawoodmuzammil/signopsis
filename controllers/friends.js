
var db          =   require("../database/config");
var firebase = require("firebase/app");
let admin = require("firebase-admin");

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
    async addFriend( req, res, next) {
        var user = firebase.auth().currentUser;
        var friend = req.params.friendId;
        
        res.send( friend);
    },

    async deleteFriend( req, res, next) {

    },

    async getFriendsList( req, res, next) {

    }
}