import { markdown } from "markdown";
import fs from "fs";
import * as fm from "front-matter";

import replaceTemp from "./replacetemp.js";

function createStatic(globalvalues, templates) {
  if (!fs.existsSync("./_public")) {
    fs.mkdirSync("./_public");
  } else {
    // Remove files in _public
    fs.readdirSync("./_public").forEach((file) => {
      fs.unlinkSync(`./_public/${file}`);
    });
  }

  fs.readdirSync("./").forEach((file) => {
    if (file.endsWith(".md")) {
      const data = fs.readFileSync(`./${file}`, "utf8");
      const frontmatter = fm.default(data);
      const values = {
        ...globalvalues,
        ...frontmatter.attributes,
        content: markdown.toHTML(frontmatter.body),
      };

      // Create _public/file.html
      fs.writeFileSync(
        `./_public/${file.replace(".md", ".html")}`,
        replaceTemp(values, templates[frontmatter.attributes.template])
      );
    }
  });
}

export default createStatic;
