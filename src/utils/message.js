const generateMessage = (message) => {
  return {
    message,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (url) => {
  return {
    url: url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
