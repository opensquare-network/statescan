const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const httpProxy = require("http-proxy");
const { loadEnvConfig } = require("@next/env");

// Load next env
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT;
if (!PORT) {
  console.log("PROT is not defined");
  process.exit();
}

const API_URL = process.env.API_URL;
if (!API_URL) {
  console.log("API_URL is not defined");
  process.exit();
}

const proxy = httpProxy.createProxyServer(
  API_URL === "https://dev-api.statescan.io/"
    ? {
        changeOrigin: true,
        target: {
          protocol: "https:",
          host: "dev-api.statescan.io",
          port: 443,
        },
      }
    : {
        target: API_URL,
      }
);

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith("/api/")) {
      req.url = req.url.replace(/^\/api/, "");

      proxy.web(req, res);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  httpServer.on("upgrade", function (req, socket, head) {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith("/api/")) {
      req.url = req.url.replace(/^\/api/, "");

      proxy.ws(req, socket, head);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
