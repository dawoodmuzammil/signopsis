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
const chatMessagesCollection = db.collection("chatMessages"); // get chats collection

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
        // check for sender if he already has this chat
        
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        var sender = "YrBpD7BnaKbMUQjAoXHkpicohjA2"; // Dawood
        var receiver = "kBRZhYLoIRWvitbuqylj3OowJQY2"; // Talha

        // const userSnapshot = await usersCollection.where('id', '==', sender).get();
        // const users = [];

        // userSnapshot.forEach((doc) => {
        //     users.push({
        //         id: doc.id,
        //         data: doc.data()
        //     });
        // })
        // res.send( users);

        // var obj = usersCollection.get();

        var content = "This is a message from Dawood to Talha";
        var seen = false;
        var message_date = date;
        var message_time = time;

        var message = {
            sender: sender,
            content: content,
            seen: seen,
            message_date: message_date,
            message_time: message_time
        }

        
        chatID = await getChatId( sender, receiver);

        res.send( chatID);        
    }
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