// import './controllers/theme-controller.js';
import { ThemeController } from './controllers/theme-controller.js';
import { ThemeView } from './views/theme-view.js';
import { ThemeService } from './services/theme-service.js';

const themeController = new ThemeController(new ThemeView(), new ThemeService());
themeController.initialize();