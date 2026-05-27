export class SortView {
    constructor() {
    }

    setButtonText = (button, sort) => {
        button.textContent = `${sort.name} ${sort.icon}`;
    }
}