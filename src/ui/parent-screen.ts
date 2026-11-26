import { h } from '../art/svg';
import { getGrowth, GARDEN_STAGES } from '../core/garden';
import { go, type Screen } from '../core/router';
import { getSettings, updateSettings, type AgeGroup, type Settings } from '../core/settings';
import { GAMES } from '../games/registry';
import { APP_VERSION } from '../config';
import { getLevel, MAX_LEVEL } from '../core/progress';

/** Parent corner: age group, volumes, what each game teaches, install help, privacy. */
export const parentScreen: Screen = (root) => {
  const settings = getSettings();

  const ageButtons = (['2-3', '4-5'] as AgeGroup[]).map((age) => {
    const b = h('button', { type: 'button', class: 'seg', 'aria-pressed': String(settings.age === age), 'data-testid': `age-${age}` }, [`${age} tahun`]);
    b.addEventListener('click', () => {
      updateSettings({ age });
      ageButtons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
    return b;
  });

  const slider = (key: keyof Pick<Settings, 'voice' | 'sfx'>, label: string) => {
    const input = h('input', { type: 'range', min: 0, max: 100, step: 10, value: Math.round(settings[key] * 100), 'aria-label': label });
    input.addEventListener('input', () => updateSettings({ [key]: Number(input.value) / 100 }));
    return h('label', { class: 'slider' }, [h('span', {}, [label]), input]);
  };

  const back = h('button', { type: 'button', class: 'btn-primary', 'data-testid': 'parent-back' }, ['Kembali ke kebun']);
  back.addEventListener('click', () => go('map'));

  root.append(
    h('div', { class: 'screen parent-screen' }, [
      h('div', { class: 'parent-scroll' }, [
        h('h2', {}, ['Pojok Orang Tua']),
        h('section', {}, [
          h('h3', {}, ['Usia anak']),
          h('p', {}, ['Mengatur jumlah benda, rentang angka, dan banyaknya pilihan.']),
          h('div', { class: 'seg-row' }, ageButtons),
        ]),
        h('section', {}, [h('h3', {}, ['Suara']), slider('voice', 'Suara narator'), slider('sfx', 'Efek suara')]),
        h('section', {}, [
          h('h3', {}, ['Kebun']),
          h('p', {}, [`Kebun sudah tumbuh ${getGrowth()} dari ${GARDEN_STAGES} tahap. Setiap satu ronde selesai, kebun bertambah satu. Kebun tidak pernah layu atau berkurang.`]),
        ]),
        h('section', {}, [
          h('h3', {}, ['Tentang permainan']),
          h('p', {}, [
            'Kebun Ceria disusun berdasarkan prinsip Montessori (benda konkret, anak mengoreksi diri tanpa dihukum, satu konsep per aktivitas), ',
            'pendekatan Konkret–Gambar–Abstrak untuk berhitung, fonik menuju suku kata untuk membaca, dan belajar sambil bermain sesuai semangat Kurikulum Merdeka PAUD. ',
            'Tidak ada skor, waktu, atau kalah. Setiap 3 ronde yang selesai, permainan itu naik satu level sedikit lebih menantang, dan level tidak pernah turun.',
          ]),
          h('ul', { class: 'game-notes' }, GAMES.map((g) => h('li', {}, [h('strong', {}, [g.name]), ` (level ${getLevel(g.id) + 1} dari ${MAX_LEVEL + 1})`, ' — ', g.parentNote]))),
        ]),
        h('section', {}, [
          h('h3', {}, ['Pasang di layar utama']),
          h('p', {}, [h('strong', {}, ['Android (Chrome): ']), 'ketuk menu ⋮ lalu "Tambahkan ke layar utama" atau "Instal aplikasi".']),
          h('p', {}, [h('strong', {}, ['iPhone (Safari): ']), 'ketuk tombol Bagikan lalu "Tambah ke Layar Utama".']),
          h('p', {}, ['Setelah terpasang, permainan bisa dibuka tanpa internet.']),
        ]),
        h('section', {}, [
          h('h3', {}, ['Privasi']),
          h('p', {}, ['Tidak ada iklan, akun, atau pelacakan. Pengaturan dan kebun hanya disimpan di perangkat ini.']),
        ]),
        back,
        h('p', { class: 'version' }, [`Versi ${APP_VERSION}`]),
      ]),
    ]),
  );
  return () => {};
};
