export class Note {
    constructor(id, title, content, dueDate, importance, completed = false) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.dueDate = dueDate;
        this.importance = importance;
        this.completed = completed;
        this.createdAt = new Date().toISOString();
        this.open = false; // New property to track if the note is open or closed
    }
}