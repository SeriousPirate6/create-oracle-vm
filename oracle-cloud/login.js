module.exports = {
  login: async ({ page }) => {
    const mail = process.env.ORACLE_MAIL;
    const password = process.env.ORACLE_PASS;

    const xpathMail = '//input[@id="idcs-signin-basic-signin-form-username"]';

    const elements = await page.$x(xpathMail);

    if (elements.length > 0) {
      const inputMail = await page.$(
        "input#idcs-signin-basic-signin-form-username"
      );

      const inputPassword = await page.$(
        'input[id="idcs-signin-basic-signin-form-password|input"]'
      );

      await inputMail.type(mail);
      await inputPassword.type(password);

      const xpathSigninButton = '//span[@id="ui-id-4"]';

      const signinButton = await page.$x(xpathSigninButton);

      if (signinButton) {
        await Promise.all([
          await signinButton[0].click(),
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
