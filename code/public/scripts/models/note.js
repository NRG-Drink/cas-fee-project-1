export class Note {
    constructor(id, title, content, dueDate, importance, completed = false) {
        this._id = id; // Using _id to match NeDB's default ID field
        this.title = title;
        this.content = content;
        this.dueDate = dueDate;
        this.importance = importance;
        this.completed = completed;
        this.createdAt = new Date(),
        this.open = false; // New property to track if the note is open or closed
    }
}