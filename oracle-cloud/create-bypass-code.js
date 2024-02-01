const { addRowJSON } = require("../utils/json");
const { sleep } = require("../utils/sleep");

module.exports = {
  createBypassCode: async ({ page }) => {
    const xpathCreateButton =
      '//a[@id="home:quick-actions:item:compute-instance"]';

    await page.waitForXPath(xpathCreateButton);

    await page.goto(process.env.ORACLE_SETTINGS_URL);

    const xpathIframe = "//iframe[@id='sandbox-identity-domains-container']";

    await page.waitForXPath(xpathIframe);

    const [iframeElementHandle] = await page.$x(xpathIframe);

    const iframeContentFrame = await iframeElementHandle.contentFrame();

    const xpathSecurity =
      '//div[@class="oui-savant-dt__actions"]' +
      '//button[contains(text(), "Security")]';

    await iframeContentFrame.waitForXPath(xpathSecurity);

    const securityButton = await iframeContentFrame.$x(xpathSecurity);

    if (securityButton) {
      await securityButton[0].click();

      const xpathGenerate =
        "//div[@data-test-id='generate-bypass-code-card']//button";

      while (true) {
        try {
          await iframeContentFrame.waitForXPath(xpathGenerate, {
            timeout: 2000,
          });

          const generateButton = await iframeContentFrame.$x(xpathGenerate);

          if (generateButton[0]) {
            await generateButton[0].click();

            const xpathExpression =
              '//div[@class="oui-modal-body"]//span[@class="bypasscode-large"]';

            await iframeContentFrame.waitForXPath(xpathExpression);

            const spanElements = await iframeContentFrame.$x(xpathExpression);

            let bypass_code = "";

            for (const spanElement of spanElements) {
              bypass_code += await iframeContentFrame.evaluate(
                (element) => element.textContent,
                spanElement
              );
            }

            await addRowJSON({
              filePath: "codes.json",
              newRow: { code: bypass_code },
            });

            const xpathCloseButton =
              '//button[@data-test-id="generate-bypass-code-dialog__close"]';

            const closeButton = await iframeContentFrame.$x(xpathCloseButton);

            if (closeButton[0]) {
              await closeButton[0].click();
            }
          }

          await sleep(500);
        } catch {
          console.log("No codes left to generate.");
          break;
        }
      }
    }
  },
};
