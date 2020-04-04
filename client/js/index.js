var socket = io();

socket.on("connect", function () {
  console.log("connected to server");
});

// listening for server to response
socket.on("newMessage", function (message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  // var li = jQuery("<li></li>").text(
  //   `${message.from} ${formattedTime}: ${message.text}`
  // );
  // jQuery("#messages").append(li);
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });
  jQuery("#messages").append(html);
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
  var formattedTime = moment(data.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    url: data.url,
    from: data.from,
    createdAt: formattedTime,
  });
  jQuery("#messages").append(html);
});
