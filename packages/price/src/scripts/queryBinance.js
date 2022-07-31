const { getKlines } = require("../binance");
const symbol = "LIT";

(async () => {
  const data = await getKlines(symbol);

  console.log(`price of ${symbol}`, data);
})();
