const fs = require("fs");
const path = require("path");
const { sleep } = require("../utils/sleep");
const {
  searchAndFillInput,
} = require("../puppeteer-utils/search-and-fill-input");
const {
  searchAndClickButton,
} = require("../puppeteer-utils/search-and-click-button");
const { renameFilesInDirectory } = require("../utils/files");
const { emptyInput } = require("../puppeteer-utils/empty-input");
const { addAttemptJSON } = require("../data-collection/create-attempt");

module.exports = {
  createVM: async ({ page }) => {
    await page.goto("https://cloud.oracle.com/compute/instances/create");

    const xpathIframe = "//iframe[@id='sandbox-compute-container']";

    await page.waitForXPath(xpathIframe);

    const [iframeElementHandle] = await page.$x(xpathIframe);

    const iframeContentFrame = await iframeElementHandle.contentFrame();

    const pathInputName =
      'input[data-test-id="create-plugin-display-name-input"]';

    await iframeContentFrame.waitForSelector(pathInputName);

    const nameInput = await iframeContentFrame.$(pathInputName);

    await emptyInput({ inputField: nameInput });

    await nameInput.type(process.env.VM_NAME);

    const xpathImageShape =
      '//fieldset[@data-test-id="image-shape-fieldset"]' +
      '//button[@class="oui-button oui-button-link oui-text-muted"]';

    const signinButton = await iframeContentFrame.$x(xpathImageShape);

    if (signinButton) {
      await signinButton[0].click();

      const chanageImageXpath = "//button[@data-test-id='change-image-button']";

      await iframeContentFrame.waitForXPath(chanageImageXpath);

      const changeImageButton = await iframeContentFrame.$x(chanageImageXpath);

      if (changeImageButton[0]) {
        await changeImageButton[0].click();

        /* select image */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: "//button[@value='Canonical Ubuntu']",
        });

        /* select image version */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: "//input[@aria-label='Select row Canonical Ubuntu 22.04']",
        });

        /* confirm image */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath:
            "//div[@class='oui-savant__Panel oui-savant__Panel--medium " +
            " oui-savant__Panel__animate']//button[@class='oui-button oui-button-primary']",
        });

        /* closing bottom window */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: "//a[@data-test-id='testid-up-arrow-cost-estimation']",
        });

        /* select shape */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: "//button[@data-test-id='change-shape-button']",
        });

        /* select shape ampere */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: "//p[@data-test-id='radio-option-ampere']",
        });

        /* select shape version */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: "//input[@aria-label='Select row VM.Standard.A1.Flex']",
        });

        const content = await iframeContentFrame.content();

        /* select cores number */
        await searchAndFillInput({
          page: iframeContentFrame,
          path: 'input[data-test-id="flex-input-VM_Standard_A1_Flexcores-test-id"]',
          text: "4",
        });

        /* confirm shape */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath:
            "//div[@class='oui-savant__Panel oui-savant__Panel--medium " +
            " oui-savant__Panel__animate']//button[@data-test-id='select-shape-button']",
        });

        /* extracting absolute path to avoid downloading errors in Chromium */
        const downloadPath = path.resolve("./keys");

        if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

        /* renaming all files in the download path, to avoid overwriting */
        await renameFilesInDirectory(downloadPath);

        const client = await page.target().createCDPSession();

        // Set download directory permissions
        await client.send("Page.setDownloadBehavior", {
          behavior: "allow",
          downloadPath,
        });

        const xpathKeyWrapper = "//div[@class='key-pair-wrapper']";

        /* download private key */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: `${xpathKeyWrapper}//span[@class='oui-margin-right']//button`,
        });

        await sleep(500);

        /* download public key */
        await searchAndClickButton({
          page: iframeContentFrame,
          xpath: `${xpathKeyWrapper}//span//button[@class='oui-button oui-button-link']`,
        });

        while (true) {
          try {
            const xpathCreate =
              '//div[@class="oui-savant__Panel--Footer"]' +
              '//button[@class="oui-button oui-button-primary"]';

            await iframeContentFrame.waitForXPath(xpathCreate, {
              timeout: 5000,
            });

            const createButton = await iframeContentFrame.$x(xpathCreate);

            /* trying create the vm */
            if (createButton[0]) await createButton[0].click();

            const xpathMessageDiv =
              '//div[@class="oui-savant__Panel--PanelMessageBlock ' +
              'oui-savant__Panel--PanelMessageBlock__Critical"]';

            /* searching for message div */
            await iframeContentFrame.waitForXPath(xpathMessageDiv);

            const divMessage = await iframeContentFrame.$x(xpathMessageDiv);

            /* extracting message from div */
            let message = await iframeContentFrame.evaluate(
              (element) => element.innerHTML,
              divMessage[0]
            );

            if (divMessage.length > 0) {
              // Access the span element within the divElement
              const spanElement = await divMessage[0].$("span");

              if (spanElement) {
                // Get the content of the span
                message = await iframeContentFrame.evaluate(
                  (element) => element.textContent,
                  spanElement
                );
                console.log("Message:", message);
              } else {
                console.log("No span element found in the div.");
              }
            } else {
              console.log("No div element found with the specified class.");
            }

            /* logging creation attempt */
            await addAttemptJSON(message);

            /* rand between 30 and 36 */
            const cooldownSeconds = Math.floor(Math.random() * 7) + 30;

            await sleep(cooldownSeconds * 1000);
          } catch {
            console.log("*** BUTTON CREATE NOT FOUND ***");

            /* logging creation attempt */
            await addAttemptJSON();

            break;
          }
        }
      }
    } else {
      console.log("Button not found.");
    }
  },
};
