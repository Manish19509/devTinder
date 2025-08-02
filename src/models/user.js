//learn from - https://mongoosejs.com/docs/guide.html

const mongoose = require("mongoose");
//npm - validator
const validator = require("validator");
//user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true, // extra spaces will be removed and same id with space can't be considered unique
      //using npm validator
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password : " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      //custom validatin function
      //by default - it will work when we create new use
      //In update api i will have to use runValidator: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://espol.school/wp-content/uploads/2024/06/Random-1024x1024.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid phot URL " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of user",
    },
    skills: {
      type: [String],
      // trim: true,
    },
  },
  //timestamps
  {
    timestamps: true,
  }
);

//mongoose model
module.exports = mongoose.model("User", userSchema); // User will always start with capital, since we will create new instances of it as we do with class
