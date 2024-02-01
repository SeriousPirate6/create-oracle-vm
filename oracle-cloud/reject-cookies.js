require("dotenv").config();

module.exports = {
  rejectCookies: async ({ page }) => {
    const xpathPopup = '//iframe[@class="truste_popframe"]';

    const popup = await page.$x(xpathPopup);

    if (popup.length > 0) {
      const iframeElementHandle = popup[0];

      const bb = "//div[@id='cookieConsentDescription']";

      const iframe = await iframeElementHandle.contentFrame();

      await iframe.waitForXPath(bb);

      console.log("Specific element found in the iframe.");

      const button = await iframe.$x('//a[@class="required"]');

      if (button) {
        await button[0].click();

        const aa = "//a[@id='gwt-debug-close_id']";
        await iframe.waitForXPath(aa);

        const closeButton = await iframe.$x(aa);

        if (closeButton) {
          await closeButton[0].click();

          return page;
        } else {
          console.log("Close button not found");
        }
      } else {
        console.log("Button not found within the iframe.");
      }
    } else {
      console.log("Iframe not found.");
    }
  },
};
