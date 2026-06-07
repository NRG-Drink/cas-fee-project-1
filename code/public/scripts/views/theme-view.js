export class ThemeView {
    constructor() {
    }

    withThemeButton(button) {
        this.themeToggleButton = button;
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme.value);
        this.themeToggleButton.textContent = `${theme.icon} ${theme.name}`;
    }
}