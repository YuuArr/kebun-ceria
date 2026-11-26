import './styles/base.css';
import { initRouter, registerScreen, go } from './core/router';
import { startScreen } from './ui/start-screen';
import { accessScreen } from './ui/access-screen';
import { mapScreen } from './ui/map-screen';
import { areaScreen } from './ui/area-screen';
import { gameScreen } from './ui/game-screen';
import { parentScreen } from './ui/parent-screen';
import './games';

initRouter(document.getElementById('app')!);
registerScreen('start', startScreen);
registerScreen('access', accessScreen);
registerScreen('map', mapScreen);
registerScreen('area', areaScreen);
registerScreen('game', gameScreen);
registerScreen('parent', parentScreen);
go('start');

// Block pinch-zoom and long-press menus that confuse small children.
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
