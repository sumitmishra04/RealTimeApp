var socket = io();

function scrollToBottom() {
  // selectors
  var messages = jQuery("#messages");
  var newMessages = messages.children("li:last-child");
  // heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessages.innerHeight();
  var lastMessageHeight = newMessages.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function () {
  console.log("connected to server");
  var params = jQuery.deparam(window.location.search);
  socket.emit("join", params, function (errors) {
    if (errors) {
      alert(errors);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
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
  scrollToBottom();
});

socket.on("disconnect", function () {
  console.log("disconnected");
});

socket.on("updateUserList", function (users) {
  console.log(users);
  var ol = jQuery("<ol><ol>");
  users.forEach(function (user) {
    ol.append(jQuery("<li></li>").text(user));
  });
  jQuery("#users").html(ol);
});

var msgTextBox = jQuery("[name='message']");
jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
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
  scrollToBottom();
});
