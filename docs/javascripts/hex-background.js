(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ROOT_CLASS = "hexagon-matrix-background";
  const SVG_CLASS = "hexagon-matrix-background__svg";
  const BLOCK_CLASS = "hexagon-matrix-background__block";
  const PAUSED_CLASS = "hexagon-matrix-background--paused";
  const CELL_ID = "site-hexagon-matrix-cell";
  const ROW_COUNT = 15;
  const LINE_COUNT = 15;
  const HEX_WIDTH = 86.5;
  const HEX_HEIGHT = 74.5;
  let visibilityListenerBound = false;

  function createSvgElement(name, attrs) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
  }

  function createBlock(line, row) {
    const index = line * ROW_COUNT + row;
    const delaySeed = (index * 83 + line * 29 + row * 47) % 997;
    const durationSeed = (index * 53 + line * 71 + row * 19) % 401;
    const opacitySeed = (index * 61 + line * 13 + row * 89) % 101;
    const block = createSvgElement("use", {
      class: BLOCK_CLASS,
      href: `#${CELL_ID}`,
      x: line % 2 ? HEX_WIDTH * row : HEX_WIDTH * row + 43.3,
      y: HEX_HEIGHT * line,
    });

    const duration = 18 + durationSeed / 80;
    const delay = -(delaySeed / 997) * duration;

    block.style.setProperty("--hex-delay", `${delay}s`);
    block.style.setProperty("--hex-duration", `${duration}s`);
    block.style.setProperty("--hex-peak-opacity", `${0.42 + opacitySeed / 500}`);
    block.style.setProperty("--hex-mid-opacity", `${0.18 + opacitySeed / 850}`);
    block.style.setProperty("--hex-rest-opacity", "0.015");

    return block;
  }

  function syncVisibilityState() {
    document.querySelectorAll(`.${ROOT_CLASS}`).forEach((node) => {
      node.classList.toggle(PAUSED_CLASS, document.visibilityState === "hidden");
    });
  }

  function bindVisibilityListener() {
    if (visibilityListenerBound) return;
    visibilityListenerBound = true;
    document.addEventListener("visibilitychange", syncVisibilityState);
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
    syncVisibilityState();
  }

  function init() {
    if (document.body) {
      bindVisibilityListener();
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
