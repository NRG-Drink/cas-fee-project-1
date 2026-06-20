import { beforeEach, describe, expect, test } from 'vitest'
import { ThemeService } from '../../../public/scripts/services/theme-service.js';
import { Theme } from '../../../public/scripts/models/theme.js';


describe('ThemeService', () => {
    let themeValues;
    let themeService;

    beforeEach(() => {
        themeValues = [
            new Theme('Light', 'light', '🌞️'),
            new Theme('Dark', 'dark', 'drk'),
            new Theme('Cloudy', 'cloudy', '☁️'),
        ];
        themeService = new ThemeService(themeValues);
    });

    test('should return the current theme', () => {
        const currentTheme = themeService.getCurrentTheme();
        expect(currentTheme).toEqual(themeValues[0]);
    });

    test('should toggle to dark theme', () => {
        const toggledTheme = themeService.toggleTheme();
        expect(toggledTheme).toEqual(themeValues[1]);
    });

    test('should toggle to cloudy theme', () => {
        themeService.toggleTheme();
        const toggledTheme = themeService.toggleTheme();
        expect(toggledTheme).toEqual(themeValues[2]);
    });

    test('should toggle back to the original theme', () => {
        themeService.toggleTheme();
        themeService.toggleTheme();
        const toggledBackTheme = themeService.toggleTheme();
        expect(toggledBackTheme).toEqual(themeValues[0]);
    });

    test('should get correct current theme after multiple toggles', () => {
        themeService.toggleTheme();
        themeService.toggleTheme();
        const currentTheme = themeService.getCurrentTheme();
        expect(currentTheme).toEqual(themeValues[2]);
    });
});