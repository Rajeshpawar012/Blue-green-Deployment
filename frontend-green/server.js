const express = require("express");
const app = express();

const PORT = 3000;          // 🔥 MUST be 3000
const COLOR = "green";

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>GREEN UI</title>
      </head>
      <body style="
        margin:0;
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:green;
        color:white;
        font-family:Arial
      ">
        <h1>GREEN UI</h1>
      </body>
    </html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Green frontend server running on port ${PORT}`);
});