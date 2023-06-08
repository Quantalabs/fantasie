import http from "http";
import fs from "fs";
import { markdown } from "markdown";
import * as fm from "front-matter";

import utils from "./utils/index.js";

function createServer(templates, globalvalues, host, port) {
  function requestListener(req, res) {
    // If request for page does not exist, return 404
    if (!fs.existsSync(`./_public${req.url === "/" ? "/index.html" : req.url}`)) {
      // If 404.html exists, return
      if (fs.existsSync("./_public/404.html")) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(fs.readFileSync("./_public/404.html"));
      }
      res.writeHead(404);
      res.end();
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

function createStatic(templates, globalvalues, host, port) {
  utils.createStatic(globalvalues, templates);

  // Host server in _public/
  function requestListener(req, res) {
    // If request for page does not exist, return 404
    if (!fs.existsSync(`./_public${req.url === "/" ? "/index.html" : req.url}`)) {
      // If 404.html exists, return
      if (fs.existsSync("./_public/404.html")) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(fs.readFileSync("./_public/404.html"));
      }
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });

    res.end(fs.readFileSync(`./_public${req.url === "/" ? "/index.html" : req.url}`, "utf8"));
  }
  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}/`);
  });
}

export default {
  createServer,
  createStatic,
};
