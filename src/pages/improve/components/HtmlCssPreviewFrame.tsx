import type { LandingPreviewCode } from "../types";

const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildPreviewSrcDoc = ({
  previewCode,
  baseUrl,
}: {
  previewCode: LandingPreviewCode;
  baseUrl: string;
}) => `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    ${baseUrl ? `<base href="${escapeHtmlAttribute(baseUrl)}" />` : ""}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; }
      html, body { width: 100%; min-height: 100%; margin: 0; overflow-x: hidden; }
      *, *::before, *::after { box-sizing: border-box; }
      ${previewCode.css}
    </style>
  </head>
  <body>
    ${previewCode.html}
  </body>
</html>`;

const HtmlCssPreviewFrame = ({
  title,
  previewCode,
  baseUrl,
  reloadKey,
}: {
  title: string;
  previewCode: LandingPreviewCode;
  baseUrl: string;
  reloadKey: number;
}) => (
  <iframe
    key={`${title}-${reloadKey}`}
    title={title}
    srcDoc={buildPreviewSrcDoc({
      previewCode,
      baseUrl,
    })}
    className="h-full w-full border-0 bg-white"
    sandbox="allow-forms allow-modals allow-popups allow-scripts"
  />
);

export default HtmlCssPreviewFrame;
