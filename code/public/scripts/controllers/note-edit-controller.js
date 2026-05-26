import { Note } from '../models/note.js';
import { NoteEditView } from '../views/note-edit-view.js';
import { NoteService } from '../services/note-service.js';

export class NoteEditController {
    constructor(noteEditView) {
        this.noteEditView = noteEditView;

        this.createButton = document.querySelector('#btn_create-note');
        this.saveButton = document.querySelector('#btn_save-note');
        this.cancelButton = document.querySelector('#btn_cancel-note');

        this.isComplete = document.querySelector('#edit-note-checkbox');
        this.dueDate = document.querySelector('#edit-note-due-date');
        this.title = document.querySelector('#edit-note-title');
        this.content = document.querySelector('#edit-note-content');
        this.importance = document.querySelector('.star-rating input[name="rating"]:checked');
    }

    withNoteSaveCallback(callback) {
        this.saveNoteCallback = callback;
    }

    initialize() {
        this.addEventListeners();
        this.noteEditView.hide();
    }

    setNoteData(note) {
        this.editNoteId = note.id;
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

    getNoteData() {
        return new Note(
            this.editNoteId,
            this.title.value,
            this.content.value,
            this.dueDate.value,
            this.getRatingValue(),
            this.isComplete.checked
        );
    }

    getRatingValue() {
        const selectedRating = document.querySelector('.star-rating input[name="rating"]:checked');
        return selectedRating ? selectedRating.value : null;
    }

    handleEditNote(note) {
        this.setNoteData(note);
        this.noteEditView.show();
    }

    handleCreateNewNote() {
        this.editNoteId = null;
        this.noteEditView.show();
    }

    handleSaveNote() {
        if (this.saveNoteCallback) {
            this.saveNoteCallback(this.getNoteData());
        }

        this.noteEditView.hide();
    }

    handleCancelEdit() {
        this.noteEditView.hide();
    }

    addEventListeners() {
        this.createButton?.addEventListener('click', () => this.handleCreateNewNote());
        this.saveButton?.addEventListener('click', () => this.handleSaveNote());
        this.cancelButton?.addEventListener('click', () => this.handleCancelEdit());
    }
}
