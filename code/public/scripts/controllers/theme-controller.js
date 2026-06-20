export class ThemeController {
    constructor(view, service) {
        this.view = view;
        this.service = service;

        this.themeToggleButton = document.querySelector('#btn_theme-toggle');
        this.view.withThemeButton(this.themeToggleButton);
    }

    initialize() {
        this.addEventListeners();
        this.toggleTheme();
    }

    toggleTheme() {
        this.view.applyTheme(this.service.toggleTheme());
    }

    addEventListeners() {
        this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
    }
}
