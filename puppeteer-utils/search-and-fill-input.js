const { emptyInput } = require("./empty-input");

module.exports = {
  searchAndFillInput: async ({ page, path, text }) => {
    await page.waitForSelector(path);

    const input = await page.$(path);

    await emptyInput({ inputField: input });

    await input.type(text);
  },
};
