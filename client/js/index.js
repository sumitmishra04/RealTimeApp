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

var msgTextBox = jQuery("[name='message']");
jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: jQuery("[name='message']").val(),
    },
    function (data) {
      msgTextBox.val("");
    }
  );
});

var locationBtn = jQuery("#location");
locationBtn.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }

  locationBtn.attr("disabled", "disabled").text("Sending location...");
  navigator.geolocation.getCurrentPosition(
    function (position) {
      locationBtn.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      locationBtn.removeAttr("disabled").text("Send location");
      alert("unable to fetch location");
    }
  );
});

socket.on("newLocationMessage", function (data) {
  var li = jQuery("<li></li>");
  var a = jQuery('<a target="_blank">My Current Location</a>');
  li.text(`${data.from}: `);
  a.attr("href", data.url);
  li.append(a);
  jQuery("#messages").append(li);
});
