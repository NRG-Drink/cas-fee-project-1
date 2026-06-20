import Datastore from "@seald-io/nedb";
import { Note } from "../public/scripts/models/note.js";
import { CONFIG } from "../config.js";

export class NoteController {
    constructor() {
        // Initialize NeDB database with file persistence
        this.db = new Datastore({
            filename: CONFIG.data("notes.db"),
            autoload: true
        });
    }

    seed = async () => {
        const notes = [
            new Note(undefined, "AAA", "KKK", new Date('2026-06-01'), 1, false),
            new Note(undefined, "BBB", "XXX", new Date('2026-06-02'), 2, true),
            new Note(undefined, "CCC", "ZZZ", new Date('2026-06-03'), 3, false),
            new Note(undefined, "DDD", "YYY", new Date('2026-06-04'), 4, true),
        ];

        for (const note of notes) {
            await this.db.insertAsync(note);
        }
    }

    getAllNotes = async (req, res) => {
        try {
            // Filter by request parameters if provided
            const filter = this.parseFilterQuery(req.query.filter);

            // Sort by request query parameters if provided, otherwise default to sorting by title
            const sortField = req.query.sortBy || 'title';
            const sortOrder = req.query.sortOrder === 'desc' || req.query.sortOrder === 'descending' ? -1 : 1;

            const notes = await this.db
                .findAsync(filter)
                .sort({ [sortField]: sortOrder });
            res.json(notes);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving notes", error: error.message });
        }
    }

    getNoteById = async (req, res) => {
        try {
            const noteId = req.params.id;
            const note = await this.db.findOneAsync({ _id: noteId });
            if (note) {
                res.json(note);
            } else {
                res.status(404).json({ message: "Note not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving note", error: error.message });
        }
    }

    addNote = async (req, res) => {
        try {
            req.body._id = undefined; // Ensure that the ID is not set by the client
            const insertedNote = await this.db.insertAsync(req.body);
            res.status(201).json(insertedNote);
        } catch (error) {
            res.status(500).json({ message: "Error creating note", error: error.message });
        }
    }

    updateNote = async (req, res) => {
        try {
            const noteId = req.params.id;
            const { _id, ...fields } = req.body;

            const { numAffected: updatedCount } = await this.db.updateAsync(
                { _id: noteId },
                { $set: fields }
            );

            if (updatedCount === 0) {
                res.status(404).json({ message: "Note not found" });
                return;
            }

            // Retrieve the updated note to return it
            const note = await this.db.findOneAsync({ _id: noteId });
            res.json(note);
        } catch (error) {
            res.status(500).json({ message: "Error updating note", error: error.message });
        }
    }

    deleteNote = async (req, res) => {
        try {
            const noteId = req.params.id;

            const deletedCount = await this.db.removeAsync({ _id: noteId });

            if (deletedCount === 0) {
                res.status(404).json({ message: "Note not found" });
                return;
            }

            res.status(200).json({ message: "Note deleted" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting note", error: error.message });
        }
    }

    parseFilterQuery = (filterQuery) => {
        let filter = {};
        if (!filterQuery) {
            return filter;
        }

        const matched = filterQuery.matchAll(/'([^$()]*)'([^()]*)'([^$()]*)'/gm);
        for (const match of matched) {
            if (match) {
                const [_, key, operator, value] = match;
                let typedValue = value;
                // Convert to boolean if the value is 'true' or 'false'
                if (value === 'true' || value === 'false') {
                    typedValue = value === 'true';
                    // Convert to number if it's a numeric string
                } else if (!isNaN(value) && value !== '') {
                    typedValue = Number(value);
                }

                if (operator) {
                    filter[key] = { [operator]: typedValue };
                } else {
                    filter[key] = typedValue;
                }
            }
        }

        return filter;
    }
}

const noteController = new NoteController();
// noteController.seed(); // Seed the database with initial notes
export { noteController };