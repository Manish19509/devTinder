const express = require("express");
const app = express();

// Basic GET route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
