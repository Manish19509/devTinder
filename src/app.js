const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); //User model

//this middleware will be activated for all the routes
app.use(express.json()); //WE will have to use middleware bcz dynamic data is comming in json format and it will convert json in js object and we can use that data

app.post("/signup", async (req, res) => {
  //for dynamic data
  //creating a new instance of the User Model
  const user = new User(req.body); //req.body is js object converted from json with help of express.json()

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

  try {
    await user.save(); //this function will return promise , most of the mongoose func return promise so use async and await
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
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
app.patch("/user", async (req, res) => {
  const userid = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userid }, data, {
      returnDocument: "after",
    });
    // console.log(user); // it will give the after updated data and if we returnDocument = "before" then it will give before data
    res.send("Uer data updated");
  } catch {
    res.status(400).send("Something went wrong");
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
