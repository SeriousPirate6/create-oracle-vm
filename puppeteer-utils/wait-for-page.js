module.exports = {
  waitForPage: async ({ page, url }) => {
    await page.waitForFunction(
      (specificText) => window.location.href.includes(specificText),
      {},
      url
    );
    console.log("Page has navigated to the desired URL.");
  },
};
