const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <html>
      <head><title>BLUE UI</title></head>
      <body style="
        margin:0;
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:blue;
        color:white;
        font-family:Arial">
        <h1>BLUE UI</h1>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Blue frontend running on port ${PORT}`);
});