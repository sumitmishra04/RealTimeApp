const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");
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
  // emit New message when client sends this event
  // socket.emit("newMessage", {
  //   from: "Ritesh",
  //   text: "great ...",
  //   createdAt: new Date(),
  // });
  // client call createMessage after submitting form

  // socket.emit from admin to new joined user
  socket.emit(
    "newMessage",
    generateMessage("Estimates", "Hi Sumit ... great you joined")
  );
  // socket.broadcast.emit from admin text new user joined except one who joined
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Estimates", "New user joined")
  );
  socket.on("createMessage", (message) => {
    console.log("create message", message);
    // server sends it's response to all client
    io.emit("newMessage", generateMessage(message.from, message.text));
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime(),
    // });
  });
});
server.listen(port, () => {
  console.log("serve is up and running");
});
