var socket = io();

socket.on("connect", function () {
  console.log("connected to server");
});

// listening for server to respons
socket.on("newMessage", function (message) {
  var li = jQuery("<li></li>").text(`${message.from}: ${message.text}`);
  jQuery("#messages").append(li);
});

socket.on("disconnect", function () {
  console.log("disconnected");
});

jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: jQuery("[name='message']").val(),
    },
    function (data) {
      console.log(data);
    }
  );
});
