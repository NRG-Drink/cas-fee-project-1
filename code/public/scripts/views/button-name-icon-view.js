export class ButtonNameIconView {
    constructor() { }

    setButtonText = (button, nameIcon) => {
        button.textContent = `${nameIcon.name} ${nameIcon.icon}`;
    }
}