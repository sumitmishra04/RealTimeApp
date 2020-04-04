var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime(),
  };
};

var generateURL = (from, coords) => {
  return {
    from,
    url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
    createdAt: new Date().getTime(),
  };
};

module.exports = { generateMessage, generateURL };
