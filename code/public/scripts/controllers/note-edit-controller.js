import { Note } from '../models/note.js';

export class NoteEditController {
    constructor(noteEditView) {
        this.noteEditView = noteEditView;

        this.createButton = document.querySelector('#btn_create-note');
        this.cancelButton = document.querySelector('#btn_cancel-note');

        this.form = document.querySelector('#note-edit-form');
    }

    withNoteSaveCallback = (callback) => {
        this.saveNoteCallback = callback;
    }

    initialize = () => {
        this.addEventListeners();
        this.noteEditView.hide();
    }

    getNoteData = () => {
        const formData = new FormData(this.form);
        return new Note(
            this.editNoteId,
            formData.get('title'),
            formData.get('content'),
            formData.get('dueDate'),
            formData.get('rating'),
            formData.get('isCompleted') === 'on'
        );
    }

    getRatingValue = () => {
        const selectedRating = document.querySelector('.star-rating input[name="rating"]:checked');
        return selectedRating ? selectedRating.value : null;
    }

    handleEditNote = (note) => {
        this.editNoteId = note._id;
        this.noteEditView.prefillForm(note);
        this.noteEditView.show();
    }

    handleCreateNewNote = () => {
        // TODO: Test data. Remove when form is working.
        ///// Test data /////
        this.noteEditView.prefillForm({
            title: 'New Note',
            dueDate: new Date().toISOString().split('T')[0], // Set to today's date.
            content: 'Hier könnte Ihre Werbung stehen!',
            importance: 1,
            completed: false,
        });
        ///// Test data /////
        this.editNoteId = null;
        this.noteEditView.show();
    }

    handleSaveNote = async () => {
        const noteData = this.getNoteData();
        console.log('Saving note:', noteData);

        // Hide first to make scroll on callback work properly.
        this.noteEditView.hide();

        if (this.saveNoteCallback) {
            await this.saveNoteCallback(noteData);
        }
    }

    handleCancelEdit = () => {
        this.noteEditView.hide();
    }

    addEventListeners = () => {
        this.createButton.addEventListener('click', () => this.handleCreateNewNote());
        // Save button
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSaveNote();
        });
        this.cancelButton.addEventListener('click', () => this.handleCancelEdit());
    }
}
