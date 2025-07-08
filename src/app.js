/*| Method      | Use For                     |
| ----------- | --------------------------- |
| `app.use()` | Middleware or base routes   |
| `app.get()` | Specific GET route handling |
*/
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Namaste Manish");
});

app.get("/hello", (req, res) => {
  res.send("Hello Hello Hello!");
});

app.get("/test", (req, res) => {
  res.send("Namaste from the server!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
