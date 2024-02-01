module.exports = {
  delay: async (time) => {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  },
};
