const { readJSON, removeFirstRowJSON } = require("../utils/json");

module.exports = {
  insertBypassCode: async ({ page }) => {
    const xpathAltMethods =
      '//div[@class="oj-flex-item idcs-signin-link-padding"]';

    await page.waitForXPath(xpathAltMethods);

    const altMethod = await page.$x(xpathAltMethods);

    if (altMethod[0]) {
      await altMethod[0].click();

      const xpathBypassOption =
        '//button[@id="idcs-mfa-mfa-auth-bypasscode-backup-button"]';

      await page.waitForXPath(xpathBypassOption);

      const bypassOption = await page.$x(xpathBypassOption);

      if (bypassOption[0]) {
        await bypassOption[0].click();

        const pathInputCode =
          'input[class="oj-inputtext-input oj-component-initnode"]';

        await page.waitForSelector(pathInputCode);

        const inputCode = await page.$(pathInputCode);

        const bypassCode = (await readJSON("codes.json")).codes[0]["code"];

        await inputCode.type(bypassCode);

        const xpathVerifyButton =
          '//oj-button[@class="oj-button-primary oj-sm-12 oj-button oj-component ' +
          'oj-button-full-chrome oj-button-text-only oj-complete oj-enabled oj-default"]';

        await page.waitForXPath(xpathVerifyButton);

        const verifyButton = await page.$x(xpathVerifyButton);

        if (verifyButton[0]) {
          await verifyButton[0].click();

          await removeFirstRowJSON("codes.json");
        }
      }
    }
  },
};
