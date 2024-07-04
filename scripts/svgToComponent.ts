import fs from "fs/promises";
import path from "path";
import os from "os";

const { EOL } = os;

async function convertToComponent(svgPath: string) {
  const svgContents = await fs.readFile(svgPath, "utf8");
}
