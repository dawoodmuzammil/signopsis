# **SaySL Signchat Microservice**

A microservice created as part of the CS492 at Bilkent University. This microservice handles user authentication and video upload for the SignChat feature.

The API is now online [here](https://saysl-signchat.herokuapp.com/).

## **Endpoints**

*  GET `/` 
    *  Displays the login page

*  POST `/login`
    *  Logs user in
    * `Body: { email: String, password: String}`

*  GET `/register` 
    *  Displays the sign-up page
    
*  POST `/register`
    *  Registers a new user
    * `Body: { email: String, password: String, name: String, dob (Date of birth): Date}`

*  GET `/video-upload` 
    *  Displays the page where we can upload videos (only for browsers - testing)

*  POST `/video-upload`
    *  Uploads a video to cloud
    * `Body: { filepath}`
    * Not really sure how this is going to work for android application
    
*  GET `/logout` 
    *  Log users out