const express = require("express");

const app = express();

//using try catch
// app.get("/getUserData", (req, res) => {
//   try {
//     throw new Error("hjdvjbdvbiud");
//     res.send("User data sent");
//   } catch (err) {
//     res.status(500).send("Some Error Contact support team");
//   }
// });

//figure out the execution - we can go without 6 line of code written
app.use("/", (err, req, res, next) => {
  // the order and number of argument matter alot in (err,req,res,next)
  if (err) {
    res.status(500).send("Something Went wrong");
  }
});

app.get("/getUserData", (req, res) => {
  //logic of DB call and get user data
  // we should use try catch

  //if not then use this - to avoid showing random message
  //just gracefully handle error

  throw new Error("jnvfkjbdfkj");
  res.send("User Data is Sent");
});

app.use("/", (err, req, res, next) => {
  // the order and number of argument matter alot in (err,req,res,next)
  if (err) {
    res.status(500).send("Something Went wrong");
  }
});
app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
