const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //job of this middleware is to read the token from the req cookies

  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is not valid!!");
    }

    const decodedObj = await jwt.verify(token, "Manish@19509");
    const { _id } = decodedObj; //got id from decodedObj
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // from here i will get user in my req in next
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
  //validate the token
  //find the user
};

module.exports = { userAuth };
