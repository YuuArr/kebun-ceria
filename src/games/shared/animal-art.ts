import { cici } from '../../art/cici';
import { thing, type ArtId } from '../../art/things';
import type { Animal } from '../../content/animals';

export const animalArt = (a: Animal): SVGSVGElement => (a.art === 'cici' ? cici('happy') : thing(a.art as ArtId));
