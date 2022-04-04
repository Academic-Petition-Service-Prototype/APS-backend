require('dotenv').config();
const http = require("http");
const app = require("./app");
const server = http.createServer(app);

// Listen port
const port = process.env.API_PORT || 3000;
const url = process.env.URL_SERVER;

//Start server
server.listen(port, () => {
  console.log(`Express is running on ${url}:${port}`);
});