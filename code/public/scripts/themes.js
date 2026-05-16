const html = document.documentElement;
// Buttons
const btnToggle = document.getElementById('btn_theme-toggle');
const btnCreate = document.getElementById('btn_create-note');

const themes = ['light', 'dark'];
const icons = { light: '🌞 Light', dark: '🌚 Dark' };

let current = localStorage.getItem('theme') || 'auto';

function applyTheme(theme) {
    if (theme === 'auto') {
        html.removeAttribute('data-theme');
    } else {
        html.setAttribute('data-theme', theme);
    }

    btnToggle.textContent = icons[theme];
    localStorage.setItem('theme', theme);
}

// Apply saved theme on load
applyTheme(current);

btnToggle.addEventListener('click', () => {
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    current = next;
    applyTheme(next);
});
