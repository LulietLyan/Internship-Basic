(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ROOT_CLASS = "hexagon-matrix-background";
  const SVG_CLASS = "hexagon-matrix-background__svg";
  const BLOCK_CLASS = "hexagon-matrix-background__block";
  const CELL_ID = "site-hexagon-matrix-cell";
  const ROW_COUNT = 15;
  const LINE_COUNT = 15;
  const HEX_WIDTH = 86.5;
  const HEX_HEIGHT = 74.5;

  function createSvgElement(name, attrs) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
  }

  function createBlock(line, row) {
    const index = line * ROW_COUNT + row;
    const seed = (index * 37 + line * 17 + row * 11) % 113;
    const centerDistance = Math.abs(row - 7) + Math.abs(line - 7);
    const block = createSvgElement("use", {
      class: BLOCK_CLASS,
      href: `#${CELL_ID}`,
      x: line % 2 ? HEX_WIDTH * row : HEX_WIDTH * row + 43.3,
      y: HEX_HEIGHT * line,
    });

    block.style.setProperty("--hex-delay", `${(seed / 113) * 1.25 + centerDistance * 0.025}s`);
    block.style.setProperty("--hex-duration", `${4.05 + ((seed * 19) % 60) / 100}s`);
    block.style.setProperty("--hex-peak-opacity", `${0.56 + ((seed * 7) % 18) / 100}`);
    block.style.setProperty("--hex-mid-opacity", `${0.28 + ((seed * 5) % 14) / 100}`);
    block.style.setProperty("--hex-rest-opacity", `${0.05 + ((seed * 3) % 5) / 100}`);
    block.style.setProperty("--hex-dash-from", seed % 2 ? "-100" : "100");

    return block;
  }

  function buildMatrix() {
    document.querySelectorAll(`.${ROOT_CLASS}`).forEach((node) => node.remove());

    const root = document.createElement("div");
    const svg = createSvgElement("svg", {
      class: SVG_CLASS,
      viewBox: "0 0 1300 1100",
      preserveAspectRatio: "xMidYMid slice",
      "aria-hidden": "true",
      focusable: "false",
    });
    const defs = createSvgElement("defs");
    const polygon = createSvgElement("polygon", {
      id: CELL_ID,
      points: "0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25",
      fill: "currentColor",
    });
    const fragment = document.createDocumentFragment();

    root.className = ROOT_CLASS;
    root.setAttribute("aria-hidden", "true");
    defs.appendChild(polygon);
    svg.appendChild(defs);

    for (let line = 0; line < LINE_COUNT; line += 1) {
      for (let row = 0; row < ROW_COUNT; row += 1) {
        fragment.appendChild(createBlock(line, row));
      }
    }

    svg.appendChild(fragment);
    root.appendChild(svg);
    document.body.prepend(root);
  }

  function init() {
    if (document.body) {
      buildMatrix();
    }
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
