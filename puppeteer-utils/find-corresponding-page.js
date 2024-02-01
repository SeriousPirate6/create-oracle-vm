require("dotenv").config();

module.exports = {
  insertCloudAccountName: async ({ loggedInBrower, url }) => {
    if (!loggedInBrower) return;

    const openPages = await loggedInBrower.pages();

    /* find the correct page between the open ones in the browser */
    const page = openPages.find((page) => page.url().includes(url));

    return page;
  },
};
