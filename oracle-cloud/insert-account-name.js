require("dotenv").config();

module.exports = {
  insertCloudAccountName: async ({ page }) => {
    const user = process.env.ORACLE_USER;

    const xpathUserInput = '//input[@id="cloudAccountName"]';

    const elements = await page.$x(xpathUserInput);

    if (elements.length > 0) {
      console.log("\nLogin URL:", page.url());

      const inputField = await page.$("input#cloudAccountName");

      await inputField.type(user);

      const xpathNext = '//a[@id="cloudAccountButton"]';

      const buttonElements = await page.$x(xpathNext);

      if (buttonElements[0]) {
        await Promise.all([
          await buttonElements[0].click(),
          await page.waitForNavigation({ waitUntil: "networkidle0" }),
        ]);

        console.log("\nData sent URL:", page.url());
      } else {
        console.log("Button not found.");
      }
    } else {
      console.log("Login not found.");
    }
  },
};
