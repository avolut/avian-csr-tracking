import { template } from "@babel/core";
import traverse from "@babel/traverse";
import { waitUntil } from "libs";
import { get, trim } from "lodash";

export const styleToCss = ({
  parsed,
  source,
}: {
  parsed: any;
  source: any;
}) => {
  traverse(parsed, {
    enter: (path) => {
      const c = path.node;

      if (c.type === "JSXOpeningElement") {
        for (let [key, i] of Object.entries(c.attributes)) {
          if (i.type === "JSXAttribute" && i.name.name === "style") {
            let style = get(i, "value.expression");
            if (style && style.start && style.end) {
              style = source.substring(style.start, style.end);
            }

            if (Array.isArray(style)) {
              style = style
                .map((e) => e.value.cooked)
                .join("")
                .trim();
            }

            style = trim(style, "`");

            if (!style) {
              style = get(i, "value.expression.value");
            }
            if (!style) {
              style = get(i, "value.value");
            }

            const div = template(`<div style={css\`${style}\`} />`, {
              sourceType: "module",
              plugins: ["jsx", "typescript"],
            })();

            const attr = get(div, "expression.openingElement.attributes.0");
            c.attributes[key] = attr;
          }
        }
      }
    },
  });
};
