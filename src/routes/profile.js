const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
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
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //validation
    if (!validateEditProfileData(req)) {
      // code in utils/validaton
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    // console.log(loggedInUser);
    // res.send(`${loggedInUser.firstName}, your profile updated successfully`);
    // or
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;
