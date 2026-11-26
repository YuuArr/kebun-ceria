import { homeIcon } from '../art/areas';
import { h } from '../art/svg';

export function homeButton(onClick: () => void): HTMLButtonElement {
  const b = h('button', { class: 'home-button', type: 'button', 'aria-label': 'Kembali', 'data-testid': 'home-button' }, [homeIcon()]);
  b.addEventListener('click', onClick);
  return b;
}
