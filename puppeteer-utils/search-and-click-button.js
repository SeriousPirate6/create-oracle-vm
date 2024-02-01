const { sleep } = require("../utils/sleep");

module.exports = {
  searchAndClickButton: async ({ page, xpath }) => {
    await sleep(500);
    const content = await page.content(); // for debug purposes

    try {
      /* searching for the path for no longer than 10 seconds */
      await page.waitForXPath(xpath, { timeout: 10000 });

      const button = await page.$x(xpath);

      await button[0].click();
    } catch {
      console.log(`XPath: ${xpath} not found.\n`);
    }
  },
};
