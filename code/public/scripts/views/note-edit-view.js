export class NoteEditView {
    constructor() {
        this.editNote = document.querySelector('#note-edit');

        this.isComplete = document.querySelector('#edit-note-checkbox');
        this.dueDate = document.querySelector('#edit-note-due-date');
        this.title = document.querySelector('#edit-note-title');
        this.content = document.querySelector('#edit-note-content');
        this.importance = document.querySelector('.star-rating input[name="rating"]:checked');
    }

    show() {
        this.editNote.style.display = 'block';
        this.editNote.scrollIntoView({ behavior: 'smooth' });
    }

    hide() {
        this.editNote.style.display = 'none';
    }

    prefillForm(note) {
        this.editNoteId = note._id;
        this.isComplete.checked = note.completed;
        this.title.value = note.title;
        this.content.value = note.content;
        this.dueDate.value = note.dueDate;
        const ratingValue = note.importance;
        if (ratingValue) {
            const ratingInput = document.querySelector(`.star-rating input[name="rating"][value="${ratingValue}"]`);
            if (ratingInput) {
                ratingInput.checked = true;
            }
        } else {
            const ratingInputs = document.querySelectorAll('.star-rating input[name="rating"]');
            ratingInputs.forEach(input => input.checked = false);
        }
    }
}