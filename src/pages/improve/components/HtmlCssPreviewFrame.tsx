import type { LandingPreviewCode } from "../types";

const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildCurrentStylesheetLinks = () => {
  if (typeof document === "undefined") return "";

  return Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  )
    .map(
      (link) =>
        `<link rel="stylesheet" href="${escapeHtmlAttribute(link.href)}" />`
    )
    .join("\n    ");
};

const buildPreviewSrcDoc = ({
  previewCode,
  baseUrl,
  includeTailwind = false,
  bodyClassName = "",
}: {
  previewCode: LandingPreviewCode;
  baseUrl: string;
  includeTailwind?: boolean;
  bodyClassName?: string;
}) => `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    ${baseUrl ? `<base href="${escapeHtmlAttribute(baseUrl)}" />` : ""}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${includeTailwind ? buildCurrentStylesheetLinks() : ""}
    ${
      includeTailwind
        ? `<script src="https://cdn.tailwindcss.com"></script>`
        : ""
    }
    <style>
      @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
      :root { color-scheme: light; }
      html, body { width: 100%; min-height: 100%; margin: 0; overflow-x: hidden; }
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: "Pretendard Variable", Pretendard, Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        background: #ffffff;
      }
      ${previewCode.css}
    </style>
  </head>
  <body class="${escapeHtmlAttribute(bodyClassName)}">
    ${previewCode.html}
  </body>
</html>`;

const HtmlCssPreviewFrame = ({
  title,
  previewCode,
  baseUrl,
  reloadKey,
  includeTailwind,
  bodyClassName,
}: {
  title: string;
  previewCode: LandingPreviewCode;
  baseUrl: string;
  reloadKey: number;
  includeTailwind?: boolean;
  bodyClassName?: string;
}) => (
  <iframe
    key={`${title}-${reloadKey}`}
    title={title}
    srcDoc={buildPreviewSrcDoc({
      previewCode,
      baseUrl,
      includeTailwind,
      bodyClassName,
    })}
    className="h-full w-full border-0 bg-white"
    sandbox="allow-forms allow-modals allow-popups allow-scripts"
  />
);

export default HtmlCssPreviewFrame;
