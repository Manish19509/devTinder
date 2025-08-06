const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); //User model
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

//this middleware will be activated for all the routes
app.use(express.json()); //WE will have to use middleware bcz dynamic data is comming in json format and it will convert json in js object and we can use that data
app.use(cookieParser()); //// <-- this is important middleware
// Why do we have to use middleware like express.json() and cookieParser() with app.use(...), but not do the same with jsonwebtoken?
// express.json() and cookieParser() are middleware functions - Because these packages need to intercept and modify incoming requests globally before they reach your route handlers.
// jsonwebtoken is not middleware — it's a utility library - These functions just return a value. They don’t modify the request/response. So you don’t use app.use() for them.

//signup
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

//profile
//without middleware
// app.get("/profile", async (req, res) => {
//   try {
//     const cookies = req.cookies;

//     const { token } = cookies;
//     //validate my token
//     if (!token) {
//       throw new Error("Invalid Token");
//     }

//     const decodedMessage = await jwt.verify(token, "Manish@19509");
//     // console.log(decodedMessage); //give id and (iat - used by jwt)
//     const { _id } = decodedMessage;
//     // console.log("Logged In user is : " + _id);

//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User does not exist");
//     }
//     res.send(user);
//     // console.log(cookies);
//     // res.send("reading cookies");
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });
//with middleware
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
    // console.log(cookies);
    // res.send("reading cookies");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//below APIS were build just for learning now we will build all API from scratch
// // GET user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.findOne({ emailId: userEmail }); //using findOne bcz there might be two person with same emailId else it will give array of user with same emailId
//     if (!users) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something went Wrong");
//   }
// });

// //Feed API - Get all the users from the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // to delete a user from the db
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     // const user = await User.findByIdAndDelete({_id:userId});
//     //shorthand of above line
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       res.send("user not found");
//     } else {
//       res.send("user deleted successfully");
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // Update data of the user
// app.patch("/user/:userId", async (req, res) => {
//   // const userId = req.body.userId;
//   const userid = req.params?.userId; //req.params -  route parameters in an Express.js reques and ?. checks if req.params exists before trying to access .userId. This helps prevent errors like Cannot read property 'userId' of undefined
//   const data = req.body;

//   try {
//     //for validatind data - limited things can only be updated
//     const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age"];

//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("update not aloowed");
//     }

//     if (data?.skills.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }

//     //after validation updation will occur
//     const user = await User.findByIdAndUpdate({ _id: userid }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     // console.log(user); // it will give the after updated data and if we returnDocument = "before" then it will give before data
//     res.send("Uer data updated");
//   } catch (err) {
//     res.status(400).send("UPDATE FAILED : " + err.message);
//   }
// });

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  //sending connection request

  console.log("Sending connection request");
  res.send(user.firstName + " Sent the connection request");
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
