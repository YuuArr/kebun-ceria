import { cici } from '../art/cici';
import { h } from '../art/svg';
import { go, type Screen } from '../core/router';
import { access, audio } from '../services';

/** For parents: enter the access code once per device. */
export const accessScreen: Screen = (root, params) => {
  const input = h('input', {
    type: 'text', inputmode: 'text', autocapitalize: 'characters', autocomplete: 'off', spellcheck: 'false',
    placeholder: 'Contoh: CERIA-1234', 'aria-label': 'Kode akses', 'data-testid': 'code-input', maxlength: 32,
  });
  const msg = h('p', { class: 'access-msg', role: 'status', 'aria-live': 'polite' });
  const btn = h('button', { class: 'btn-primary', type: 'submit', 'data-testid': 'code-submit' }, ['Buka']);
  const form = h('form', { class: 'access-form' }, [input, btn]);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    const ok = await access.tryUnlock(input.value);
    btn.disabled = false;
    if (ok) {
      go('map', params);
    } else {
      msg.textContent = 'Kode belum cocok, coba lagi ya.';
      input.select();
    }
  });
  root.append(
    h('div', { class: 'screen access-screen' }, [
      h('div', { class: 'card' }, [
        h('div', { class: 'card-mascot' }, [cici()]),
        h('h2', {}, ['Masukkan Kode']),
        h('p', {}, ['Kode ada di pesan pembelian dari toko. Cukup sekali di HP ini.']),
        form,
        msg,
      ]),
    ]),
  );
  void audio.play('umum_kode');
  return () => audio.stop();
};
