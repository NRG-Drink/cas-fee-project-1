import { Theme } from '../models/theme.js';

export class ThemeService {
    constructor() {
        this.index = 0;
        this.themes = [
            new Theme('Light', 'light', '🌞️'),
            new Theme('Dark', 'dark', '🌚'),
        ];
    }

    getCurrentTheme() {
        return this.themes[this.index];
    }

    toggleTheme() {
        this.index = (this.index + 1) % this.themes.length;
        return this.getCurrentTheme();
    }
}