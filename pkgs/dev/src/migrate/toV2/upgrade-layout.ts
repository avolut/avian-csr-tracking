import generate from "@babel/generator";
import { dirs } from "boot";
import { remove, writeFile } from "fs-extra";
import { trim } from "lodash";
import { join } from "path";
import prettier from "prettier";
import { parseEffect } from "../toV1/upgrade-page";
import { styleToCss } from "./convert-css";

export const upgradeLayoutV2 = async (path: string) => {
  const fullPath = join(dirs.app.web, "src", "base", "layout", path);
  const { effect, parsed, source } = await parseEffect(fullPath);

  let run = effect.run;
  if (run.startsWith("()")) {
    run = `({meta, children}) ${run.substring(2)}`;
  } else if (run.startsWith("async ()")) {
    run = `async ({meta, children}) ${run.substring("async ()".length)}`;
  }

  styleToCss({parsed, source})

  const code = prettier.format(
    `\
base({
  meta: ${effect.meta},
  init: ${run}
}, ({meta, children}) => (${trim(generate(parsed).code, ";")}))`,
    {
      parser: "babel-ts",
    }
  );
  await remove(fullPath);
  await writeFile(
    join(
      dirs.app.web,
      "src",
      "base",
      "layout",
      path.substring(0, path.length - 4) + ".base.tsx"
    ),
    code
  );
};
