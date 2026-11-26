export type ScreenName = 'start' | 'access' | 'map' | 'area' | 'game' | 'parent';
export type Params = Record<string, string>;
/** Renders into root and returns a cleanup function. */
export type Screen = (root: HTMLElement, params: Params) => () => void;

const screens = new Map<ScreenName, Screen>();
let root: HTMLElement | null = null;
let cleanup: (() => void) | null = null;
let current: { name: ScreenName; params: Params } | null = null;

export function initRouter(el: HTMLElement): void {
  root = el;
}

export function registerScreen(name: ScreenName, screen: Screen): void {
  screens.set(name, screen);
}

export function currentScreen() {
  return current;
}

export function go(name: ScreenName, params: Params = {}): void {
  if (!root) throw new Error('Router not initialised');
  const screen = screens.get(name);
  if (!screen) throw new Error(`Unknown screen ${name}`);
  cleanup?.();
  root.replaceChildren();
  root.dataset.screen = name;
  current = { name, params };
  cleanup = screen(root, params);
}
