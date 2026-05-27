export class ButtonSortView {
    constructor() {
    }

    setButtonText = (button, sort) => {
        button.textContent = `${sort.name} ${sort.icon}`;
    }
}