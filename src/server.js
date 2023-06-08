import http from "http";
import fs from "fs";
import { markdown } from "markdown";
import * as fm from "front-matter";

import utils from "./utils/index.js";

function createServer(templates, globalvalues, host, port) {
  function requestListener(req, res) {
    // If request is for favicon.ico, return ./favicon.ico if exists
    if (req.url === "/favicon.ico" && fs.existsSync("./favicon.ico")) {
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      res.end(fs.readFileSync("./favicon.ico"));
      return;
    }
    if (req.url === "/favicon.ico") {
      // Don't send favicon.ico
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });

    // If url is / then get index.md if not get the url, relpacing .html with .md
    const filepath = req.url === "/" ? "./index.md" : `.${req.url.replace(".html", ".md")}`;

    // Read the file
    const data = fs.readFileSync(filepath, "utf8");
    const frontmatter = fm.default(data);
    const values = {
      ...globalvalues,
      ...frontmatter.attributes,
      content: markdown.toHTML(frontmatter.body),
    };

    // Render the file
    res.end(utils.replacetemp(values, templates[frontmatter.attributes.template]));
  }
  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

export default {
  createServer,
};
