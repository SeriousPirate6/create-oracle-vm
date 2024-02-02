module.exports = {
  timestampToDate: (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const readableDate = `${year}-${month}-${day}`;

    return readableDate;
  },

  timestampToTime: (timestamp) => {
    const date = new Date(timestamp);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const readableTime = `${hours}:${minutes}:${seconds}`;

    return readableTime;
  },
};
