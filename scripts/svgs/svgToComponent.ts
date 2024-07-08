import fs from "fs/promises";
import path from "path";

const outputDir = path.join(__dirname, "../../src/server/svgs/");
const publicDir = path.join(__dirname, "../../public/");

async function convertToComponent(svgPath: string) {
  const svgContents = await fs.readFile(svgPath, "utf8");
  const svgName = getNameFromPath(svgPath);

  const newContents = svgContents
    .replace(/fill="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"/g, 'fill="currentColor"')
    .replace(
      /stroke="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"/g,
      'stroke="currentColor"'
    );

  await fs.writeFile(
    path.join(outputDir, `${svgName}.svg`),
    newContents,
    "utf8"
  );
}

export function getNameFromPath(inputPath: string, separator?: string) {
  const svgSplit = inputPath.split(separator ? separator : path.sep);
  const nameChars = svgSplit[svgSplit.length - 1].split(".")[0].split("");
  return nameChars.join("").replace(".", "");
}

async function getPathsForDir(dir: string) {
  return (await fs.readdir(dir, { encoding: "utf8", recursive: true }))
    .filter((path) => path.endsWith(".svg"))
    .map((filteredPath) => path.join(publicDir, filteredPath));
}

async function generateAllSvgs() {
  const inputSvgPaths = await getPathsForDir(publicDir);
  inputSvgPaths.forEach(convertToComponent);
}

generateAllSvgs();
