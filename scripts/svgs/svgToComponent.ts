import fs from "fs/promises";
import path from "path";

const { sep } = path;
const svgTemplatePath = "./svgTemplate.tsx";
const outputDir = path.join(__dirname, "../../src/server/svgs/");
const publicDir = path.join(__dirname, "../../public/");

async function convertToComponent(svgPath: string) {
  const svgContents = await fs.readFile(svgPath, "utf8");
  const svgName = getNameFromPath(svgPath);

  const newContents = svgContents.replace(
    /fill="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"/g,
    'fill="currentColor"'
  );

  const svgTemplate = await fs.readFile(svgTemplatePath, "utf8");

  const namePlaceholder = "Base";
  const contentPlaceholder = "/*content*/";

  const svgTemplateFilled = svgTemplate
    .replace(namePlaceholder, svgName)
    .replace(contentPlaceholder, newContents);

  await fs.writeFile(
    path.join(outputDir, `${svgName}Svg.tsx`),
    svgTemplateFilled,
    "utf8"
  );
}

function getNameFromPath(inputPath: string) {
  const svgSplit = inputPath.split(sep);
  const nameChars = svgSplit[svgSplit.length - 1].split(".")[0].split("");
  nameChars[0] = nameChars[0].toUpperCase();
  return nameChars.join().replace(".", "");
}

async function generateAllSvgs() {
  const inputSvgPaths = (
    await fs.readdir(publicDir, { encoding: "utf8", recursive: true })
  ).filter((path) => path.endsWith(".svg"));
  const outputSvgNames = (
    await fs.readdir(outputDir, {
      encoding: "utf8",
      recursive: true,
    })
  )
    .filter((path) => path.endsWith("Svg.tsx"))
    .map((svgPath) => {
      const svgPathSplit = svgPath.split(sep);
      const name = svgPathSplit[svgPathSplit.length - 1].split("Svg")[0];
      return name;
    });
  inputSvgPaths
    .filter(
      (inputSvgPath) =>
        !outputSvgNames.some((name) =>
          inputSvgPath.toLowerCase().includes(name.toLowerCase())
        )
    )
    .forEach(convertToComponent);
}

generateAllSvgs();
