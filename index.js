const { fullProcess } = require("./process/oracle-full-process");
const { readJSON, addRowJSON, removeFirstRowJSON } = require("./utils/json");

(async () => {
  await fullProcess({ debug: true });
})();
