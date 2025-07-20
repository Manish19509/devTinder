const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user"); //User model

app.post("/signup", async (req, res) => {
  // const useObj = {
  //   firstName: "Manish",
  //   lastName: "Keshri",
  //   emailId: "Manish@gmail.com",
  //   Password: "Manish@123",
  // };
  // //creating a new instance of the User Model
  // const user = new User(userObj);

  //or we can write
  const user = new User({
    //we can also set id but it will be better to keep it done by mongoDB
    firstName: "Rahul",
    lastName: "Keshri",
    emailId: "Rahul@gmail.com",
    Password: "Rahul@123",
  });

  try {
    await user.save(); //this function will return promise , most of the mongoose func return promise so use async and awi
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
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
