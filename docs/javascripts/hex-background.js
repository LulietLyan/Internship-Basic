(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ROOT_CLASS = "hex-matrix-background";
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
  const MOBILE_QUERY = "(max-width: 768px)";

  let svg;
  let blocks = [];
  let timer = 0;

  function createSvgElement(name, attrs) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
  }

  function shouldAnimate() {
    return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }

  function getCellSize() {
    return window.matchMedia(MOBILE_QUERY).matches ? 58 : 78;
  }

  function buildMatrix() {
    if (!svg) {
      svg = createSvgElement("svg", {
        class: ROOT_CLASS,
        "aria-hidden": "true",
        focusable: "false",
      });
      document.body.prepend(svg);
    }

    clearInterval(timer);
    timer = 0;
    blocks = [];
    svg.replaceChildren();

    const width = window.innerWidth || document.documentElement.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight;
    const radius = getCellSize() / 2;
    const horizontal = radius * 1.72;
    const vertical = radius * 1.5;
    const columns = Math.ceil(width / horizontal) + 3;
    const rows = Math.ceil(height / vertical) + 3;
    const fragment = document.createDocumentFragment();

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    for (let row = -1; row < rows; row += 1) {
      for (let column = -1; column < columns; column += 1) {
        const cx = column * horizontal + (row % 2 ? horizontal / 2 : 0);
        const cy = row * vertical;
        const points = [];

        for (let side = 0; side < 6; side += 1) {
          const angle = (Math.PI / 3) * side - Math.PI / 2;
          points.push(
            `${(cx + radius * Math.cos(angle)).toFixed(2)},${(
              cy + radius * Math.sin(angle)
            ).toFixed(2)}`
          );
        }

        const polygon = createSvgElement("polygon", {
          class: "hex-matrix-cell",
          points: points.join(" "),
        });

        polygon.style.setProperty("--hex-delay", `${Math.random() * 1400}ms`);
        fragment.appendChild(polygon);
        blocks.push(polygon);
      }
    }

    svg.appendChild(fragment);

    if (shouldAnimate()) {
      startRandomPulse();
    }
  }

  function pulseCell(cell) {
    cell.classList.remove("is-lit");
    cell.style.setProperty("--hex-intensity", (0.34 + Math.random() * 0.5).toFixed(2));
    cell.style.setProperty("--hex-glow", `${(10 + Math.random() * 16).toFixed(1)}px`);

    requestAnimationFrame(() => {
      cell.classList.add("is-lit");
      window.setTimeout(() => {
        cell.classList.remove("is-lit");
      }, 420 + Math.random() * 560);
    });
  }

  function startRandomPulse() {
    const burstSize = window.matchMedia(MOBILE_QUERY).matches ? 3 : 7;

    timer = window.setInterval(() => {
      if (!blocks.length) {
        return;
      }

      for (let i = 0; i < burstSize; i += 1) {
        const cell = blocks[Math.floor(Math.random() * blocks.length)];
        window.setTimeout(() => pulseCell(cell), Math.random() * 260);
      }
    }, 145);
  }

  function scheduleRebuild() {
    clearTimeout(scheduleRebuild.handle);
    scheduleRebuild.handle = window.setTimeout(buildMatrix, 180);
  }

  function init() {
    if (!document.body) {
      return;
    }

    buildMatrix();
  }

  window.addEventListener("resize", scheduleRebuild, { passive: true });

  const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
  if (typeof reducedMotionMedia.addEventListener === "function") {
    reducedMotionMedia.addEventListener("change", buildMatrix);
  } else if (typeof reducedMotionMedia.addListener === "function") {
    reducedMotionMedia.addListener(buildMatrix);
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
