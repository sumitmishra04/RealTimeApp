const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");
const index = require("./routes/index");

const { generateMessage, generateURL } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
const clientPath = path.join(__dirname, "../client");
const port = process.env.PORT || 5000;

const app = express();
app.use(index);

const server = http.createServer(app);
// get web socket server
const io = socketIO(server);
const getApiAndEmit = async (socket) => {
  try {
    const res = await axios.get(
      "https://boiling-chamber-47433.herokuapp.com/welcome"
    ); // Getting the data from DarkSky
    console.log("THEN BLOCK", JSON.stringify(res.data));
    // fetch("https://boiling-chamber-47433.herokuapp.com/welcome").then((res) => {
    //   console.log("THEN BLOCK", res);
    socket.emit("FromAPI", JSON.stringify(res.data)); // Emitting a new message. It will be consumed by the client
    // });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

var users = new Users();
// serves up the public folder
// app.use(express.static(clientPath));
// listen for new connection and do something in the callback
io.on("connection", (socket) => {
  getApiAndEmit(socket);
  socket.on("join", (params, callback) => {
    console.log("PARAMS", params);
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }
    socket.join(params.room);

    // socket.leave('the ofc room');
    // io.emit -> to every user
    // socket.broadcats.emit -> all but except one
    // socket.emit -> only to one
    // io.to('The Office Fans').emit
    // socket.broadcats.to('The Office Fans').emit -> all but except one

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    // socket.emit from admin to new joined user
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Hi ... great you joined")
    );
    // socket.broadcast.emit from admin text new user joined except one who joined
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined`)
      );
    callback();
  });

  // when user leaves
  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left`)
      );
    }

    console.log("client disconnected");
  });

  // client call createMessage after submitting form

  socket.on("createMessage", (message, callback) => {
    // server sends it's response to all client
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
    callback("This is from the server");
  });

  // https://google.com/maps?q=12.9399368,77.7326561
  socket.on("createLocationMessage", (coords, callback) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateURL(user.name, coords)
      );
    }
  });
});
server.listen(port, () => {
  console.log("serve is up and running");
});
