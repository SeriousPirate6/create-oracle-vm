const fs = require("fs");

module.exports = {
  readJSON: (readJSON = async (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          reject();
        }

        try {
          const jsonData = JSON.parse(data);
          console.log("JSON data fetched successfully.");
          resolve(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          reject();
        }
      });
    });
  }),

  writeJSON: (writeJSON = async (filePath, jsonData) => {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFile(filePath, jsonData, (err) => {
          if (err) {
            console.error("Error writing file:", err);
            reject();
          }
          console.log("JSON file updated successfully.");
          resolve();
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject();
      }
    });
  }),

  addRowJSON: async ({ filePath, newRow }) => {
    return new Promise(async (resolve, reject) => {
      const jsonData = await readJSON(filePath);

      try {
        jsonData.codes.push(newRow);

        const updatedJsonData = JSON.stringify(jsonData, null, 2);

        await writeJSON(filePath, updatedJsonData);
        resolve();
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject();
      }
    });
  },

  removeFirstRowJSON: async (filePath) => {
    return new Promise(async (resolve, reject) => {
      const jsonData = await readJSON(filePath);

      try {
        jsonData.codes.splice(0, 1);

        const updatedJsonData = JSON.stringify(jsonData, null, 2);

        await writeJSON(filePath, updatedJsonData);
        resolve();
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject();
      }
    });
  },
};
