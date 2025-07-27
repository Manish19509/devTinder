//learn from - https://mongoosejs.com/docs/guide.html

const mongoose = require("mongoose");

//user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },      
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

//mongoose model
module.exports = mongoose.model("User", userSchema); // User will always start with capital, since we will create new instances of it as we do with class
