# **SaySL Signchat Microservice**

A microservice created as part of the CS492 at Bilkent University. This microservice handles user authentication and video upload for the SignChat feature.

The API is now online [here](https://saysl-signchat.herokuapp.com/).

## **Endpoints**

*  GET `/` 
    *  Displays the login page

======================= USER ACTIONS =======================

*  POST `/login`
    *  Logs user in
    * `Body: { email: String, password: String}`

*  GET `/register` 
    *  Displays the sign-up page
    
*  POST `/register`
    *  Registers a new user
    * `Body: { email: String, password: String, name: String, dob (Date of birth): Date}`
    
*  GET `/logout` 
    *  Log users out

---- UPDATE ACTIONS ----
* PUT `/update-name`
    * Updates displayName property of user
    * Example JSON payload:
        * `{`
        * `   "name": "Example Name"`
        * `}`
        
* PUT `/update-email`
    * Update email of user
    * Example JSON payload:
        * `{`
        * `   "email": "example@example.com"`
        * `}`
* PUT `/update-password`
    * Update password of user
    * Example JSON payload:
        * `{`
        * `   "password": "xxxxxxxx"`
        * `}`

* POST `/reset-password`
    * Sends a password reset email to the user
    * Example JSON payload:
        * `{`
        * `   "email": "example@example.com"`
        * `}`
    * Response
        * Email sending successful: `200 OK`
        * Email sending unsuccesful: `500 Internal Server Error`

======================= CHATS =======================
* GET `/chats/:chatId`
    * Get a particular chat    

* POST `/chats/:receiverId/sendMessage`
    * Sends a message from user X to user Y
    * `Body: { content: String }`        
    * **content**: message content
    * **example:**                
        * "content":  "This is a test message from X to Y"

*  GET `/video-upload` 
    *  Displays the page where we can upload videos (only for browsers - testing)

*  POST `chats/:receiverId/sendVideo`
    *  Uploads a video to cloud
    * `Body: { filepath}`
    * Not really sure how this is going to work for android application

======================= FRIENDS =======================

*  GET `/friends` 
    * Gets the list of friends for the currently signed in user

*  GET `/friends/:friendId/add-friend`
    * Adds a friend with friendId as the userId

*  GET `/friends/:friendId/add-friend` 
    * Deletes a friend with friendId as the userId

 

