var cloudinary  =   require("cloudinary");
var db          =   require("../database/config");
var firebase    =   require("firebase/app");
let admin       =   require("firebase-admin");
var UserSchema  =   require("../models/users");
var ChatSchema  =   require("../models/chats");
var mongoose    =   require ('mongoose');

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

// const usersCollection = db.collection("users"); // get chats collection
const chatsCollection = db.collection("chats"); // get chats collection

module.exports = {
    async getAllChats( req, res, next) {
        var user = firebase.auth().currentUser;
        let chatRef

        // if user found
        if ( user) {
            // extract unique ID of user
            var uid = user.uid; 

            // retrieve user's chatIDs from Mongo
            var userInfo = await UserSchema.findById( uid);
            var chatIds = userInfo.chats;

            // check if he has any chats
            if ( chatIds.length > 0) {
                // retrieve information from the ChatSchema about all his chats, sorted by lastMessage date
                var chats = await ChatSchema.find( {
                    '_id': { $in: chatIds}
                }).populate('members', 'name').sort('-lastMessage');
                res.send( chats);
            }
            else {
                // user has no chats.
                res.status(200).send("You have no chats.");
            }
        }
        else 
            res.status(400).send("User is not logged in.");
    },

    async getChat( req, res, next) {
        var user = firebase.auth().currentUser;

        if ( user) {
            // chat if that chat retrieved indeed belongs to the user
            var chat = await ChatSchema.findById( req.params.chatId);
            var members = chat.members;
            var belongs = members.includes( user.uid);

            if (!belongs) {
                res.status(400).send("The chat you requested does not belong to you.");
            }
            else {
                var chatInfo = await ChatSchema.findById( req.params.chatId).populate('members', 'name');        

                var chatId = chat._id;
                var snapshot = await chatsCollection
                                .doc( "" + chatId)
                                .collection('messages')
                                .get();
                var messages = snapshot.docs.map(doc => doc.data());                                
                res.send( {messages, chatInfo});
            }            
        }
        else {
            res.status(400).send("User not logged in.");
        }
    },

    // /chats/:receiverId/sendVideo
    async postVideo( req, res, next) {                
        var user = firebase.auth().currentUser;

        if ( user) {
            var sender = user.uid;
            var receiver = req.params.receiverId;
            
            // check for sender if he already has this chat        
            var chat = await ChatSchema.findOne({ "members": { $all : [sender, receiver] } } )            
            
            
            // if chat exists, send message
            if ( !chat) {                        
                chat = await createChat( sender, receiver);               
                updateUserChatsCollection( chat._id, sender, receiver);
                var chatRef = await chatsCollection.doc( "" + chat._id).set({});                 
            }

            // upload video on cloudinary            
            var video = await cloudinary.v2.uploader.upload(req.file.path,                 
                {
                    resource_type: "video",
                    transformation: [
                        {
                            width: 300, 
                            crop: "scale"
                        },
                        {
                            gravity: "south", 
                            x: 0, 
                            y: 34, 
                            width: 250,
                            overlay: {
                                font_family: "Roboto", 
                                font_size: 16, 
                                text_align: "center", 
                                text: req.body.translation
                            }, 
                            crop: "fit",                                
                            color: "white"
                        }
                        ]
                }, function(error, result) { 
                    console.log(result, error);
                });

            // prepare message string
            var messageContent = "You have received a new video message from " + user.displayName + ".\n\nLink to the video: ";
            messageContent += video.secure_url;
            
            // prepare message object
            var message = {
                sender: sender,
                content:  messageContent,
                seen: false,
                message_date: getDate(),
                message_time: getTime(),
            }

            // update lastMessage in Mongo
            await ChatSchema.findByIdAndUpdate( chat._id, { lastMessage: Date.now() });
            
            // add message to Firebase
            let createdMessage = await chatsCollection.doc( "" + chat._id)                                    
                                        .collection("messages")
                                        .add(message);        
            res.status(200).send( chat._id);  // could return something else, too    
        }
        else {
            res.status(400).send("User not logged in.");         
        }
    },

    // /chats/:receiverId/sendMessage
    async postSendMessage( req, res, next) {
        var user = firebase.auth().currentUser;

        if ( user) {
            var sender = user.uid;
            var receiver = req.params.receiverId;
            
            // check for sender if he already has this chat        
            var chat = await ChatSchema.findOne({ "members": { $all : [sender, receiver] } } )            
            
            
            // if chat exists, send message
            if ( !chat) {                        
                chat = await createChat( sender, receiver);               
                updateUserChatsCollection( chat._id, sender, receiver);
                var chatRef = await chatsCollection.doc( "" + chat._id).set({}); 
                console.log( chatRef);
            }

            // prepare message object
            var message = {
                sender: sender,
                content:  req.body.content,
                seen: false,
                message_date: getDate(),
                message_time: getTime(),
            }

            // update lastMessage in Mongo
            await ChatSchema.findByIdAndUpdate( chat._id, { lastMessage: Date.now() });
            
            // add message to Firebase
            let createdMessage = await chatsCollection.doc( "" + chat._id)                                    
                                        .collection("messages")
                                        .add(message);        
            res.status(200).send( chat._id);  // could return something else, too    
        }
        else {
            res.status(400).send("User not logged in.");         
        }
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

async function createChat( sender, receiver) {
    let chatObj = {
        members: [sender, receiver],
        // lastMessage: null
        createdAt: Date.now()
    }
    let createdChat = await ChatSchema.create( chatObj);    
    return createdChat._id;
}

async function updateUserChatsCollection( chatID, sender, receiver) {    
    // get users
    var senderUser = await UserSchema.findById( sender);
    var receiverUser = await UserSchema.findById( receiver);

    // update chats array for each user
    await senderUser.chats.push( chatID);
    senderUser.save();
    await receiverUser.chats.push( chatID);
    receiverUser.save();
}