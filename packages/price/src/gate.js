const AbortController = require("abort-controller");

async function getLatest(symbol) {
  const url = new URL(
    `api2/1/ticker/${symbol}_USDT`,
    "https://data.gateapi.io"
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
    });
    const json = await res.json();
    return json;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("request was aborted");
    }
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  getLatest,
};
