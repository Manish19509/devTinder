const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://Manish:pTLtJqJQ0yZpTRwo@cluster0.zosohnz.mongodb.net/"
// );
//upside written code is not a good way bcz
//it returns promise, tell connection successfully established or not by async and await

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Manish:pTLtJqJQ0yZpTRwo@cluster0.zosohnz.mongodb.net/devTinder" //using devTinder db from cluster
  );
};

// connectDB()
//   .then(() => {
//     console.log("Database connection established");
//   })
//   .catch((err) => {
//     console.error("Database cannot be connected");
//   });

//but by using this , our server is starting listening then our db connection is getting established
//we do this bcz user can do API call when server is listening and at that momment of time db might not be connected
//so we export this function

module.exports = connectDB;