const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }
  // else if(firstName.length <4 || firstName.lenght >50){
  //     throw new Error("First Name should be 4 - 50 characters");
  // } // we can also do the same thing on schema we made
  else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid Email ID !");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password !");
  }
};

module.exports = {
  validateSignUpData,
};
