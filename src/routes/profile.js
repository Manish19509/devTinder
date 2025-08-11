const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

//profile

//without middleware
// app.get("/profile", async (req, res) => {
//   try {
//     const cookies = req.cookies;

//     const { token } = cookies;
//     //validate my token
//     if (!token) {
//       throw new Error("Invalid Token");
//     }

//     const decodedMessage = await jwt.verify(token, "Manish@19509");
//     // console.log(decodedMessage); //give id and (iat - used by jwt)
//     const { _id } = decodedMessage;
//     // console.log("Logged In user is : " + _id);

//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User does not exist");
//     }
//     res.send(user);
//     // console.log(cookies);
//     // res.send("reading cookies");
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

//with middleware
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
