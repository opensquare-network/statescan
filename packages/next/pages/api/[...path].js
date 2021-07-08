import httpProxy from "http-proxy";

const API_URL = process.env.API_URL;
const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req, res) => {
  return new Promise((resolve, reject) => {
    req.url = req.url.replace(/^\/api/, "");

    proxy.once("error", (e) => {
      res.status(500).json({ error: e.message });
      reject();
    });

    proxy.web(req, res, {
      target: API_URL,
      autoRewrite: false,
    });

    proxy.on("end", resolve);
  });
};
