const NS = 'http://www.w3.org/2000/svg';

type Attrs = Record<string, string | number | undefined>;
type Child = Node | string | null | undefined | false;

/** Creates an SVG element. */
export function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, children: Child[] = []): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) el.setAttribute(k, String(v));
  for (const c of children) if (c) el.append(c);
  return el;
}

/** Creates an HTML element. `class` and other attributes go in attrs. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, children: Child[] = []): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) el.setAttribute(k, String(v));
  for (const c of children) if (c) el.append(c);
  return el;
}

/** An <svg> root with a viewBox. */
export function svgRoot(viewBox: string, children: Child[] = [], attrs: Attrs = {}): SVGSVGElement {
  return s('svg', { viewBox, xmlns: NS, 'aria-hidden': 'true', ...attrs }, children);
}
