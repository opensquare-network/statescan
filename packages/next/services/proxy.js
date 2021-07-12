import httpProxy from "http-proxy";

const API_URL = process.env.API_URL;
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
    : undefined
);

export default proxy;
