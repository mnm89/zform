import fs from "node:fs";
import path from "node:path";

const SHADCN_COMPONENTS = [
  "alert",
  "badge",
  "button",
  "command",
  "checkbox",
  "form",
  "input",
  "label",
  "popover",
  "select",
  "switch",
  "textarea",
  "scroll-area"
];

const EXTERNAL_DEPENDENCIES = [
  "libphonenumber-js@1",
  "date-fns@3",
  "world-countries@5",
  "react-day-picker@9",
];
const main = () => {
  const name = "zform";
  const zformDir = path.join(process.cwd(), "zform");
  const files = fs
    .readdirSync(zformDir, {
      recursive: true,
      withFileTypes: true,
    })
    .filter((file) => file.isFile())
    .map((file) => {
      return {
        path: `./zform${file.parentPath.replace(zformDir, "")}/${file.name}`,
        content: fs.readFileSync(
          path.join(file.parentPath, file.name),
          "utf-8"
        ),
        type: "registry:block",
        target: `~/zform${file.parentPath.replace(zformDir, "")}/${file.name}`,
      };
    });
  const output = {
    name,
    type: "registry:block",
    registryDependencies: SHADCN_COMPONENTS,
    files,
    dependencies: EXTERNAL_DEPENDENCIES,
  };

  fs.writeFileSync(
    path.join(process.cwd(), "setup.json"),
    JSON.stringify(output, null, 2)
  );
};

main();
