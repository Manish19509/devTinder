# DevTinder APIs

## authRouter

- Post /signup
- Post /login
- POST /logout

## profileRouther

- GET/profile/view - for getting priflie view
- PATCH/profile/edit - for updating profile not the email id
- PATCH/profile/password - to change password - forgot password

## connectionRequestRouter

- POST/request/send/interested/:userId
- POST/request/send/ignored/:userId
- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId

## userRouter

//to get all connection

- GET/user/connection
  //to get all received request
- GET/user/requests/receiveed
- GET/user/feed

status : ignored, interested , accepted , rejected
