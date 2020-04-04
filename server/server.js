const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const clientPath = path.join(__dirname, "../client");
const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
// get web socket server
const io = socketIO(server);

// serves up the public folder
app.use(express.static(clientPath));
// listen for new connection and do something in the callback
io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
  socket.emit("newMessage", {
    from: "Ritesh",
    text: "great ...",
    createdAt: new Date(),
  });

  socket.on("createMessage", (message) => {
    console.log("create message", message);
  });
});
server.listen(port, () => {
  console.log("serve is up and running");
});
