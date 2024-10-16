const fs = require("fs");
require("dotenv").config({ path: "./.env" });
const API_VERSION = process.env.API_VERSION;

const serverRoutes = (app) => {
  const routeFiles = fs.readdirSync(`./routes/${API_VERSION}`);

  routeFiles.forEach((routeFile) => {
    if (routeFile.endsWith(".js")) {
      const routePath = routeFile
        .replace(".js", "")
        .replace(/Routes$/, "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();
      const routeModule = require(`./${API_VERSION}/${routeFile}`);
      app.use(`/api/${API_VERSION}/${routePath}`, routeModule);
      console.log(`/api/${API_VERSION}/${routePath}`);
    }
  });
};

module.exports = serverRoutes;
