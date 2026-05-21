const html = document.documentElement;
const btnToggle = document.getElementById('btn_theme-toggle');

let themeIndex = 0;
const themeValues = [
    { name: 'Dark', value: 'dark', icon: '🌚' },
    { name: 'Light', value: 'light', icon: '🌞' }
]

function applyTheme(theme) {
    html.setAttribute('data-theme', theme.value);
    btnToggle.textContent = `${theme.icon} ${theme.name}`;
}

// Apply saved theme on load
applyTheme(themeValues[themeIndex]);

btnToggle.addEventListener('click', () => {
    themeIndex = (themeIndex + 1) % themeValues.length;
    applyTheme(themeValues[themeIndex]);
});
