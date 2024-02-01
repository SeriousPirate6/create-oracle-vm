const { createVM } = require("../oracle-cloud/create-vm");

module.exports = {
  loopCreateVM: (loopCreateVM = async ({ page }) => {
    const startTime = Date.now();

    while ((Date.now() - startTime) / 1000 / 60 < 1) {
      await createVM({ page });
    }

    await page.reload();

    await loopCreateVM({ page });
  }),
};
