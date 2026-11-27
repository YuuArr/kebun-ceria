import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import '@fontsource/fredoka/latin-600.css';
import './styles/base.css';
import './styles/paper.css';
import './styles/layout.css';
import { initRouter, registerScreen, go } from './core/router';
import { startScreen } from './ui/start-screen';
import { accessScreen } from './ui/access-screen';
import { mapScreen } from './ui/map-screen';
import { areaScreen } from './ui/area-screen';
import { gameScreen } from './ui/game-screen';
import { parentScreen } from './ui/parent-screen';
import { albumScreen } from './ui/album-screen';
import './games';
import { rotateHint } from './core/orientation';

initRouter(document.getElementById('app')!);
registerScreen('start', startScreen);
registerScreen('access', accessScreen);
registerScreen('map', mapScreen);
registerScreen('area', areaScreen);
registerScreen('game', gameScreen);
registerScreen('parent', parentScreen);
registerScreen('album', albumScreen);
document.body.append(rotateHint());
go('start');

// Block pinch-zoom and long-press menus that confuse small children.
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
