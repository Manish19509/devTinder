/*| Method      | Use For                     |
| ----------- | --------------------------- |
| `app.use()` | Middleware or base routes   |
| `app.get()` | Specific GET route handling |
*/
const express = require("express");
const app = express();

// app.use("/", (req, res) => { // in  this case(app.use) "/" will match to route of every other route. so in all case it will print this result only
//   res.send("Namaste Manish");// if we will put this code at end then this will not occur bcz order of code matters , it works from top to bottom
// });
//

// this will match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//   res.send("Namaste from the server!");
// });
//This will match all the HTTP method API calls to /user
// app.use("/user", (req, res) => {
//   res.send("HAHAHAHAHAHAH");
// });

// so we can use get - This will handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstNmae: "Manish Kumar", lastName: "Keshri" });
});
// this will handle postcall to /user
app.post("/user", (req, res) => {
  res.send("Data successfully saved to the database!");
});

app.delete("/user", (req, res) => {
  res.send("Deleted Successfully!");
});



app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
