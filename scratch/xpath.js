module.exports = {
  findXpathFromConsole: async () => {
    const xpathExpression =
      '//div[@class="oui-savant-dt__actions"]' +
      '//button[contains(text(), "Security")]'; // Replace with your XPath expression
    const result = document.evaluate(
      xpathExpression,
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    const node = result.iterateNext();

    if (node) {
      console.log("YESS xpath", xpathExpression);
    } else {
      console.log("NOPE xpath", xpathExpression);
    }
  },
};
