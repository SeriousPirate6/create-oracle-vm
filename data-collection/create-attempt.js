const fs = require("fs");
const { writeJSON, readJSON } = require("../utils/json");
const { timestampToDate, timestampToTime } = require("../utils/date");

module.exports = {
  addAttemptJSON: async (message) => {
    const attemptsJSON = "attempts.json";

    if (!fs.existsSync(attemptsJSON)) {
      await writeJSON(attemptsJSON, JSON.stringify({ attempts: {} }));
    }

    const jsonData = await readJSON(attemptsJSON);

    const timestamp = Date.now();
    const date = timestampToDate(timestamp);
    const time = timestampToTime(timestamp);

    const attemptObj = jsonData.attempts;
    const datesList = Object.keys(attemptObj);

    /* formatting message */
    if (message) {
      const dotIndex = message.indexOf(".");
      message =
        dotIndex !== -1 ? message.substring(0, dotIndex + 1) : message + ".";
    } else {
      message = "";
    }

    /* if the file has already been created */
    if (!datesList[0]) {
      jsonData.attempts[date] = [{ 1: time, message }];

      await writeJSON(attemptsJSON, JSON.stringify(jsonData, null, 2));
      return;
    }

    const timesList = Object.values(attemptObj);

    const lastTime = timesList[timesList.length - 1];

    const lastNum = Number(Object.keys(lastTime[lastTime.length - 1])[0]);

    if (datesList[datesList.length - 1] !== date) {
      jsonData.attempts[date] = [{ [lastNum + 1]: time, message }];
      await writeJSON(attemptsJSON, JSON.stringify(jsonData, null, 2));
      return;
    }

    jsonData.attempts[date].push({ [lastNum + 1]: time, message });

    await writeJSON(attemptsJSON, JSON.stringify(jsonData, null, 2));
  },
};
