const fs = require("fs");
const path = require("path");

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}.${minutes}.${seconds}`;
}

module.exports = {
  searchFilesInDirectory: (searchFilesInDirectory = async (
    directoryPath,
    callback
  ) => {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(callback(err, null));
        }
        resolve(callback(null, files));
      });
    });
  }),

  renameFilesInDirectory: async (directoryPath) => {
    await searchFilesInDirectory(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        reject();
      }

      return new Promise((resolve, reject) =>
        files.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error("Error retrieving file stats:", err);
              reject();
            }

            if (stats.isFile()) {
              const fileExtension = path.extname(file);
              const fileNameWithoutExtension = path.basename(
                file,
                fileExtension
              );
              const timeRegex = /\d{2}\.\d{2}\.\d{2}/;
              if (!timeRegex.test(fileNameWithoutExtension)) {
                const currentTime = getCurrentTime();
                const newFileName = `${fileNameWithoutExtension}_${currentTime}${fileExtension}`;
                const newFilePath = path.join(directoryPath, newFileName);

                fs.rename(filePath, newFilePath, (err) => {
                  if (err) {
                    console.error(`Error renaming file ${file}:`, err);
                    reject();
                  }
                  console.log(`File ${file} renamed to ${newFileName}`);
                });
              }
            }
            resolve();
          });
        })
      );
    });
  },
};
