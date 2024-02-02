const { fullProcess } = require("./process/oracle-full-process");

(async () => {
  await fullProcess({ debug: true });
})();
