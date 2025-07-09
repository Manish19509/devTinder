const express = require("express");
const app = express();

// // Basic use route
// // we can make multiple route handler in single route

// //important
// //we can wrape multiple route Handler(rH) in array in different format and it will give same output as shown below
// // app.use("/route", rH1, rH2, rH3, rH4);
// // app.use("/route", [rH1, rH2, rH3, rH4]);
// // app.use("/route", rH1, [rH2, rH3], rH4);
// // app.use("/route", [rH1, rH2], rH3, rH4);

// //how express works
// // GET/users => IT CHAECKS ALL APP.XXX("MATCHING ROUTE") Function
// //i.e. GET/users => middleware chain => request handler

// app.use(
//   "/",
//   (req, res, next) => {
//     // this arrow function is route handler
//     // res.send("Route Handler 1"); //if i will not send response then it will just make continuous request and after a time it will stop making request
//     console.log("Handling the route user 1!!"); //printed in terminal
//     next(); // it will take to the next route handler
//     res.send("Route Handler 1"); //if we keep this code here then 2nd route handler will give response and this will give ERROR(Cannot set headers after they are sent to the client)
//     //we can know why we got this error by seeing js code execution sequence and there can't be morethan one response
//   },
//   (req, res) => {
//     res.send("Route Handler 2"); //it will give error(Cannot set headers after they are sent to the client) if 1st route handler will give response
//     //if not then this response will get send
//     //postman has got the response and the connection will get close b/w postman and our server

//     console.log("Handling the route user 2!!");
//   },
//   (req, res) => {
//     res.send("Route Hnadler 3!!");
//     console.log(
//       "this code will not get executes bcz we sent response and there is no next function in previous route handler"
//     );
//   }
// );

//we will have to write code for checking the request is authoried or not in each case
// app.get("/admin/getAllData", (req, res) => {
//   //logic of checking if the request is authorized
//   const token = "xyb";
//   const isAdminAuthorized = token === "xyz";
//   if (isAdminAuthorized) {
//     res.send("All Data Sent");
//   } else {
//     res.status(401).send("unauthorized request");
//   }
// });
// app.get("/admin/deleteUser", (req, res) => {
//   //logic of checking if the request is authorized
//   res.send("Deleted a user");
// });

// but else we can do it as shown below
// app.use("/admin", (req, res, next) => {
//   console.log("Admin auth is getting checked");
//   const token = "xz";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("unauthorized request");
//   } else {
//     next();
//   }
// });

// or else we can kepp upper code in auth.js and can simply import it
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  //we can write like this also
  res.send("user data sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent");
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
});

// Start the server
const PORT = 7777;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
