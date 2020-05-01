var cloudinary  =   require("cloudinary");
var db          =   require("../database/config");
var firebase = require("firebase/app");
let admin = require("firebase-admin");

// Add the Firebase products that you want to use
require("firebase/auth");
// require("firebase/firestore");

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
// firebase.initializeApp(firebaseConfig);
// firebase.auth.Auth.Persistence.LOCAL;

cloudinary.config({
    cloud_name: 'dfifvbzoq',
    api_key: '465132132992649',
    api_secret: process.env.CLOUDINARY_URL
});

const usersCollection = db.collection("users"); // get chats collection
const chatsCollection = db.collection("chats"); // get chats collection
const userChatsCollection = db.collection("userChats"); // get chats collection
// const messagesCollection = chatsCollection.collection("messages"); // get chats collection

module.exports = {
    // POST VIDEO
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
            console.log(chatObj);
            let addChatObj = chatsCollection.add( chatObj);

            res.send(chatObj.url);
        }
        else {
            res.redirect("/");
        }
    },

    async postSendMessage( req, res, next) {
        var sender = req.body.sender; // Dawood
        var receiver = req.body.receiver; // Talha        
        
        // check for sender if he already has this chat        
        var chatID = await getChatId( sender, receiver);

        // if chat exists, send message
        if ( !chatID) {                        
            chatID = await createChat( sender, receiver);            
            updateUserChatsCollection( chatID, sender, receiver);
        }

        var message = {
            sender: sender,
            content:  req.body.content,
            seen: false,
            message_date: getDate(),
            message_time: getTime()
        }
        
        let createdMessage = await chatsCollection.doc( chatID)
                                    .collection("messages")
                                    .add(message);
        await chatsCollection.doc( chatID).update({
                            lastMessage: createdMessage.id
                        });
        

        res.send( chatID);        
    }
}

function getDate() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    
    return date;
}

function getTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return time;
}

async function getChatId( sender, receiver) {

    // get all chatIds of sender
    var senderSnapshot = await chatsCollection.where('members', 'array-contains', sender).get();
    var senderChatId = [];
    
    senderSnapshot.forEach( (doc) => {
        senderChatId.push(doc.id);
    });

    // get all chatIds of receiver
    var receiverSnapshot = await chatsCollection.where('members', 'array-contains', receiver).get();
    var receiverChatId = [];

    receiverSnapshot.forEach( (doc) => {
        receiverChatId.push( doc.id)
    });

    // the intersection of both the arrays will be the chatId of (sender, receiver) pair    
    let chatID = senderChatId.filter( x => receiverChatId.includes(x));
    
    return chatID[0];
}

async function createChat( sender, receiver) {
    let chatObj = {
        members: [sender, receiver],
        lastMessage: null
    }
    let createdChat = await chatsCollection.add( chatObj);
    return createdChat.id;
}

async function updateUserChatsCollection( chatID, sender, receiver) {
    let senderRef = userChatsCollection.doc( sender);
    let receiverRef = userChatsCollection.doc( receiver);    

    let senderUpdate = await senderRef.update({
        chats: admin.firestore.FieldValue.arrayUnion( chatID)
    });

    let receiverUpdate = await receiverRef.update({
        chats: admin.firestore.FieldValue.arrayUnion( chatID)
    })
}