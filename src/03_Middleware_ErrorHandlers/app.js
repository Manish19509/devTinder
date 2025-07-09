const express = require("express");
const app = express();

// Basic use route
// we can make multiple route handler in single route

//important
//we can wrape multiple route Handler(rH) in array in different format and it will give same output as shown below
// app.use("/route", rH1, rH2, rH3, rH4);
// app.use("/route", [rH1, rH2, rH3, rH4]);
// app.use("/route", rH1, [rH2, rH3], rH4);
// app.use("/route", [rH1, rH2], rH3, rH4);

app.use(
  "/",
  (req, res, next) => {
    // this arrow function is route handler
    // res.send("Route Handler 1"); //if i will not send response then it will just make continuous request and after a time it will stop making request
    console.log("Handling the route user 1!!"); //printed in terminal
    next(); // it will take to the next route handler
    res.send("Route Handler 1"); //if we keep this code here then 2nd route handler will give response and this will give ERROR(Cannot set headers after they are sent to the client)
    //we can know why we got this error by seeing js code execution sequence and there can't be morethan one response
  },
  (req, res) => {
    res.send("Route Handler 2"); //it will give error(Cannot set headers after they are sent to the client) if 1st route handler will give response
    //if not then this response will get send
    //postman has got the response and the connection will get close b/w postman and our server

    console.log("Handling the route user 2!!");
  },
  (req, res) => {
    res.send("Route Hnadler 3!!");
    console.log(
      "this code will not get executes bcz we sent response and there is no next function in previous route handler"
    );
  }
);

// Start the server
const PORT = 7777;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
