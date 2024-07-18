import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
const outDir = path.join(__dirname, "~/src/py-receipt-server/temp");

export async function getReceiptData(base64Image: string) {
  const buffer = Buffer.from(base64Image, "base64");
  const id = uuid();

  const outPath = path.join(outDir, id);
  console.log("Writing to path: ", outPath);

  await fs.writeFile(outPath, buffer);

  // await fetch()
}
