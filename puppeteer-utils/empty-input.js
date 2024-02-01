module.exports = {
  emptyInput: async ({ inputField }) => {
    await inputField.click({ clickCount: 3 }); // Select all the text
    await inputField.press("Backspace"); // Delete the text
  },
};
