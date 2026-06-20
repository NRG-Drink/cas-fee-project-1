import { Note } from '../models/note.js';

export class NoteServiceOnline {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.resetFiltersAndSorting();
    }

    http = async (method, path, data = null) => {
        const url = `http://${this.host}:${this.port}${path}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        };

        try {
            // return fetch(url, options).then(response => response.json());
            console.log(`SEND: ${method} / ${url} data: ${JSON.stringify(data)}`);
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonResponse = await response.json();
            console.log(`RECEIVE: ${method} / ${url} data: ${JSON.stringify(jsonResponse).slice(0, 100)}...`); // Log only the first 100 characters of the response for brevity.
            return jsonResponse;
        } catch (error) {
            console.error(`Error during HTTP request to ${url}:`, error);
            throw error;
            // return null;
        }
    }

    /**
     * @param {number} noteId - The ID of the note to be retrieved.
     * @returns {Note|null} - The note with the specified ID, or null if not found.
     */
    getNoteById = async (noteId) => {
        return await this.http('GET', `/notes/${noteId}`);
    }

    /**
     * @returns {Note[]} - The list of notes, filtered and sorted.
     */
    getNotes = async () => {
        // return this.http('GET', '/notes');
        let route = '/notes';
        let queries = [];

        if (this.filterFunction && this.filterFunction.length > 2) {
            queries.push(`filter=${this.filterFunction}`);
        }

        if (this.sortFunction && this.sortFunction.sortBy) {
            queries.push(`sortBy=${this.sortFunction.sortBy}`);
            queries.push(`sortOrder=${this.sortFunction.sortOrder}`);
        }

        if (queries.length > 0) {
            route += `?${queries.join('&')}`;
        }

        const notes = await this.http('GET', route) ?? [];
        return notes;
    }

    /**
     * @param {Note} note - The note to be added. The ID will be generated automatically.
     */
    addNote = async (note) => {
        const response = await this.http('POST', '/notes', note);
        return new Note(
            response._id,
            response.title,
            response.content,
            response.dueDate,
            response.importance,
            response.completed
        );
    }

    /**
     * @param {Note} updatedNote - The note with updated properties. The ID must match an existing note.
     */
    updateNote = async (updatedNote) => {
        return await this.http('PUT', `/notes/${updatedNote._id}`, updatedNote);
    }

    /**
     * @param {number} noteId - The ID of the note to be removed.
     */
    removeNote = async (noteId) => {
        return await this.http('DELETE', `/notes/${noteId}`);
    }

    /**
     * @param {function} sortFunction - The function to sort the notes.
     */
    sortNotes = (sortFunction) => {
        this.sortFunction = sortFunction;
    }

    /**
     * @param {function} filterFunction - The function to filter the notes.
     */
    filterNotes = (filterFunction) => {
        this.filterFunction = filterFunction;
    }

    /**
     * Resets the filters and sorting to their default states (no filtering, sorting by ID).
     */
    resetFiltersAndSorting = () => {
        this.resetSorting();
        this.resetFiltering();
    }

    /**
     * Resets the sorting to the default state (sorting by ID).
     */
    resetSorting = () => {
        this.sortFunction = (a, b) => a._id - b._id;
    }

    /**
     * Resets the filtering to the default state (no filtering).
     */
    resetFiltering = () => {
        this.filterFunction = () => true;
    }
}
