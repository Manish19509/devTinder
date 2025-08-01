const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); //User model
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

//this middleware will be activated for all the routes
app.use(express.json()); //WE will have to use middleware bcz dynamic data is comming in json format and it will convert json in js object and we can use that data

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //h/w -> useemailid validator

    const user = await User.findOne({ emailId: emailId }); //using findOne bcz there might be two person with same emailId else it will give array of user with same emailId
    if (!user) {
      // throw new Error("Entered wrong EmailId");//don't give this info
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password); // return true or false

      if (isPasswordValid) {
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

// GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail }); //using findOne bcz there might be two person with same emailId else it will give array of user with same emailId
    if (!users) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong");
  }
});

//Feed API - Get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// to delete a user from the db
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({_id:userId});
    //shorthand of above line
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.send("user not found");
    } else {
      res.send("user deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update data of the user
app.patch("/user/:userId", async (req, res) => {
  // const userId = req.body.userId;
  const userid = req.params?.userId; //req.params -  route parameters in an Express.js reques and ?. checks if req.params exists before trying to access .userId. This helps prevent errors like Cannot read property 'userId' of undefined
  const data = req.body;

  try {
    //for validatind data - limited things can only be updated
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not aloowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    //after validation updation will occur
    const user = await User.findByIdAndUpdate({ _id: userid }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    // console.log(user); // it will give the after updated data and if we returnDocument = "before" then it will give before data
    res.send("Uer data updated");
  } catch (err) {
    res.status(400).send("UPDATE FAILED : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    //server will listen after the db connection established
    app.listen(7777, () => {
      console.log("server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
