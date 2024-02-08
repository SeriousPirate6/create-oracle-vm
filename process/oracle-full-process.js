const {
  insertCloudAccountName,
} = require("../oracle-cloud/insert-account-name");
const { login } = require("../oracle-cloud/login");
const { createVM } = require("../oracle-cloud/create-vm");
const { rejectCookies } = require("../oracle-cloud/reject-cookies");
const { insertBypassCode } = require("../oracle-cloud/insert-bypass-code");
const { createBypassCode } = require("../oracle-cloud/create-bypass-code");
const { createConnection } = require("../puppeteer-utils/create-connection");

module.exports = {
  fullProcess: async ({ debug }) => {
    /* fetching the login page */
    const page = await createConnection({
      url: process.env.ORACLE_CLOUD_URL,
      debug,
    });

    /* rejecting cookies from pop-up window */
    await rejectCookies({ page });

    /* insert Oracle account name */
    await insertCloudAccountName({ page });

    /* rejecting cookies (again) */
    await rejectCookies({ page });

    /* perform the login */
    await login({ page });

    /* bypass the 2FA with a pregenerated code */
    await insertBypassCode({ page });

    /* generate one or more bypass codes available */
    await createBypassCode({ page });

    /* looping the createVM functions with proper cooldowns */
    await createVM({ page });
  },
};
