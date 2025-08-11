const express = require("express");
const { validateSignUpData } = require("../utils/validation.js");
const User = require("../models/user"); //User model
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//signup
authRouter.post("/signup", async (req, res) => {
  //in sign up we should follow these steps
  try {
    //1> validation of data
    validateSignUpData(req);

    //2> ENCRYPTION OF PASSWORD - read-> npm - bcrypt
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // 10 -> saltRounds , we can also generate random number of saltRounds
    // console.log(passwordHash); //to print encrypted password

    //for dynamic data
    //creating a new instance of the User Model
    // const user = new User(req.body); //req.body is js object converted from json with help of express.json()
    //below line is also doing similar thing
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    //this is a hardcoded data - not for dynamic

    // const useObj = {
    //   firstName: "Manish",
    //   lastName: "Keshri",
    //   emailId: "Manish@gmail.com",
    //   Password: "Manish@123",
    // };

    // //creating a new instance of the User Model
    // const user = new User(userObj);

    //or we can write below code

    // const user = new User({
    //   //we can also set id but it will be better to keep it done by mongoDB
    //   firstName: "Rahul",
    //   lastName: "Keshri",
    //   emailId: "Rahul@gmail.com",
    //   Password: "Rahul@123",
    // });

    await user.save(); //this function will return promise , most of the mongoose func return promise so use async and await
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //h/w -> useemailid validator

    const user = await User.findOne({ emailId: emailId }); //using findOne bcz there might be two person with same emailId else it will give array of user with same emailId
    if (!user) {
      // throw new Error("Entered wrong EmailId");//don't give this info
      throw new Error("Invalid Credentials");
    } else {
      // const isPasswordValid = await bcrypt.compare(password, user.password); // return true or false
      const isPasswordValid = await user.validatePassword(password); //offloaded this to user.js , to make it reusable and readable code

      if (isPasswordValid) {
        //here i will write the logic of cookies and all
        //pseudo steps
        //create a JWT Token

        // const token = await jwt.sign({ _id: user._id }, "Manish@19509", {
        //   expiresIn: "1d",
        // }); //the token which will created will hide userid with secret key Manish@19509(vvimp) and will expire in 1 day

        //imp - instead of writing above 3 lines of code ,we can write one line code as blow, bcz we had wrote above code in user.js , it is a better way of writting

        const token = await user.getJWT();
        // console.log(token);

        //add the token to cookie ans send the response back to the user
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        }); //got code from express - and we are expiring cookie after 8h

        res.send("Loging successful!!!");
      } else {
        // throw new Error("Password is not correct");
        throw new Error("Invalid Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//logout
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      express: new Date(Date.now()),
    })
    .send("Logout Sussessful");
  //above chaining is used else we can also write in this way
  // res.cookie("token", null, {
  //   express: new Date(Date.now()),
  // });
  // res.send();
});

module.exports = authRouter;
