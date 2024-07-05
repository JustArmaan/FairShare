import type { Request, Response, NextFunction } from "express";
import { parse, HTMLElement } from "node-html-parser";
import path from "path";
import fs from "fs";
import { getNameFromPath } from "../../../scripts/svgs/svgToComponent";

export function remapSvgs(_: Request, res: Response, next: NextFunction) {
  const resSendFunc = res.send;

  res.send = (
    body: Parameters<typeof resSendFunc>
  ): ReturnType<typeof resSendFunc> => {
    // @ts-ignore
    if (typeof body !== "string") return resSendFunc(body);
    const newBody = replaceWithSvg(body);
    return resSendFunc.call(res, newBody);
  };
  next();
}

function replaceWithSvg(body: string) {
  const root = parse(body);
  root
    .querySelectorAll("img")
    .map((img) => ({ img, src: img.getAttribute("src") }))
    .filter(
      (item) =>
        item.src?.endsWith(".svg") && item.img.hasAttribute("custom-color")
    )
    .forEach(replaceWithDiv);

  const newBody = root.toString();
  return newBody;
}

function replaceWithDiv(item: { img: HTMLElement; src: string | undefined }) {
  if (!item.src) return;

  let divString = "<div ";
  Object.entries(item.img.attributes)
    .filter(([key]) => key !== "src")
    .forEach(([key, value]) => {
      divString += `${key}="${value}" `;
    });
  const svgPath = path.join(
    __dirname,
    "../svgs/",
    `${getNameFromPath(item.src)}.svg`
  );
  const svgContents = fs.readFileSync(svgPath, { encoding: "utf8" });
  const svgElement = parse(svgContents);
  svgElement.querySelectorAll("*:not(mask):not(mask *)").forEach((element) => {
    element.removeAttribute("width").removeAttribute("height");
  });
  const parsedSvgString = svgElement.toString();
  divString = `${divString}>${parsedSvgString}</div>`;
  const div = parse(divString);
  item.img.replaceWith(div);
}
