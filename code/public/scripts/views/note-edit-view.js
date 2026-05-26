export class NoteEditView {
    constructor() {
        this.editNote = document.querySelector('#note-edit');
    }

    withSaveButton(button) {
        this.saveButton = button;
    }

    withCancelButton(button) {
        this.cancelButton = button;
    }

    show() {
        this.editNote.style.display = 'block';
        this.editNote.scrollIntoView({ behavior: 'smooth' });
    }

    hide() {
        this.editNote.style.display = 'none';
        this.editNote.scrollIntoView({ behavior: 'smooth' });
    }
}