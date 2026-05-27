import { ThemeController } from './controllers/theme-controller.js';
import { ThemeView } from './views/theme-view.js';
import { ThemeService } from './services/theme-service.js';

const themeController = new ThemeController(new ThemeView(), new ThemeService());
themeController.initialize();

import { NoteEditController } from './controllers/note-edit-controller.js';
import { NoteEditView } from './views/note-edit-view.js';

const noteEditController = new NoteEditController(new NoteEditView());
noteEditController.initialize();

import { SortController } from './controllers/sort-controller.js';
import { SortService } from './services/sort-service.js';
import { SortView } from './views/sort-view.js';
import { NoteService } from './services/note-service.js';

const noteService = new NoteService(getTestNotes());
const sortController = new SortController(new SortService(), new SortView(), noteService);
sortController.initialize();

import { NoteController } from './controllers/note-controller.js';
import { NoteView } from './views/note-view.js';

const noteController = new NoteController(new NoteView(), noteService, noteEditController, sortController);
noteController.initialize();

function getTestNotes() {
    return [
        {
            id: 1,
            createdAt: '2024-06-01T10:00:00Z',
            completed: false,
            dueDate: '2024-06-10',
            title: 'Buy groceries',
            content: 'Milk, Bread, Eggs, Butter',
            importance: 3,
            open: true,
        },
        {
            id: 2,
            createdAt: '2024-06-02T12:00:00Z',
            completed: true,
            dueDate: '2024-06-05',
            title: 'Finish project report',
            content: 'Complete the final report for the project and submit it by the deadline.',
            importance: 5,
            open: false,
        },
        {
            id: 3,
            createdAt: '2024-06-03T14:00:00Z',
            completed: false,
            dueDate: '2024-06-15',
            title: 'Plan weekend trip',
            content: 'Research destinations, book accommodations, and plan activities for the weekend trip.',
            importance: 2,
            open: true,
        },
        {
            id: 4,
            createdAt: '2024-06-04T16:00:00Z',
            completed: false,
            dueDate: '2024-06-20',
            title: 'Read new book',
            content: 'Start reading the new book that was recommended by a friend.',
            importance: 1,
            open: true,
        },
        {
            id: 5,
            createdAt: '2024-06-05T18:00:00Z',
            completed: true,
            dueDate: '2024-06-08',
            title: 'Call plumber',
            content: 'Schedule an appointment with the plumber to fix the leaking sink in the kitchen.',
            importance: 4,
            open: true,
        },
        {
            id: 6,
            createdAt: '2024-06-06T20:00:00Z',
            completed: false,
            dueDate: '2024-06-25',
            title: 'Organize garage',
            content: 'Clean and organize the garage, sort out old items for donation or disposal.',
            importance: 3,
            open: true,
        }
    ]
}