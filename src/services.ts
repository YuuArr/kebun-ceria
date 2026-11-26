import { Howl } from 'howler';
import { createAudio } from './core/audio';
import { createSharedCodeAccess } from './core/access';
import { ACCESS_HASHES } from './config';

export const audio = createAudio({ Howl: Howl as never, base: import.meta.env.BASE_URL });
export const access = createSharedCodeAccess(ACCESS_HASHES);
