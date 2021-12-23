
import { generate } from 'libs/babel';
import { remove, writeFile } from "libs/fs";
import { trim } from "lodash-es";
import { join } from "path";
import prettier from "prettier";
import { parseEffect } from "../toV1/upgrade-page";
import { styleToCss } from "./convert-css";

export const upgradeComponentsToV2 = async (arg: {
  compFiles: string[];
  migrating: boolean;
  compDir: string;
  externals: Record<string, string>;
}) => {
  const { compFiles, migrating, compDir, externals } = arg;

  const compJsx = compFiles.filter((e) => e.endsWith(".jsx"));

  for (let p of compJsx) {
    const fullPath = join(compDir, p);
    const { effect, parsed, source } = await parseEffect(fullPath);

    let run = effect.run;
    if (run.startsWith("()")) {
      run = run.substring(2) + `({meta, params, children})`;
    } else if (run.startsWith("async ()")) {
      run =
        run.substring("async ()".length) + `async ({meta, params, children})`;
    }

    styleToCss({ parsed, source });
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
      join(compDir, p.substring(0, p.length - 4) + ".base.tsx"),
      code
    );
  }

  return compFiles;
};
