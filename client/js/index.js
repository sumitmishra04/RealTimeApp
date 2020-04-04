var socket = io();

socket.on("connect", function () {
  console.log("connected to server");
  socket.emit("createMessage", {
    from: "sumit",
    text: "hi.. how are u",
    createdAt: new Date(),
  });
});
socket.on("disconnect", function () {
  console.log("disconnected");
});
socket.on("newMessage", function (message) {
  console.log(message);
});
