const http = require("http");
const app = require("./app");
const server = http.createServer(app);

// Listen port
const port = process.env.API_PORT || 3000;

//Start server
server.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});

//Start server test git merge
// server.listen(port, () => {
//   console.log(`Express is running on http://localhost:${port}`);
// });