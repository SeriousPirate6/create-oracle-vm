const puppeteer = require("puppeteer");

module.exports = {
  createConnection: async ({ url, debug = false }) => {
    const browser = await puppeteer.launch({
      headless: debug ? false : "new", // suppressing warnings,
    });

    const page = await browser.newPage();

    await page.goto(url);

    return page;
  },
};
