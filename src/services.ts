import { Howl } from 'howler';
import recorded from 'virtual:audio-list';
import { createAudio } from './core/audio';
import { createSharedCodeAccess } from './core/access';
import { ACCESS_HASHES } from './config';

export const audio = createAudio({ Howl: Howl as never, base: import.meta.env.BASE_URL, available: new Set(recorded) });
export const access = createSharedCodeAccess(ACCESS_HASHES);
