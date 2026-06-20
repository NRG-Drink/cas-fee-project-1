import { ThemeController } from './controllers/theme-controller.js';
import { ThemeView } from './views/theme-view.js';
import { ThemeService } from './services/theme-service.js';

const themeView = new ThemeView();
const themeService = new ThemeService();
const themeController = new ThemeController(themeView, themeService);
themeController.initialize();

import { NoteEditController } from './controllers/note-edit-controller.js';
import { NoteEditView } from './views/note-edit-view.js';

const noteEditView = new NoteEditView();
const noteEditController = new NoteEditController(noteEditView);
noteEditController.initialize();

import { FilterController } from './controllers/filter-controller.js';
import { FilterService } from './services/filter-service.js';
import { ButtonNameIconView } from './views/button-name-icon-view.js';
// import { NoteService } from './services/note-service.js';
import { NoteServiceOnline } from './services/note-service-online.js';

const filterView = new ButtonNameIconView();
const filterService = new FilterService();
// const noteService = new NoteService(getTestNotes());
const noteService = new NoteServiceOnline('127.0.0.1', 3004);
const filterController = new FilterController(filterView, filterService, noteService);
filterController.initialize();

import { SortController } from './controllers/sort-controller.js';
import { SortService } from './services/sort-service.js';

const sortService = new SortService();
const sortView = new ButtonNameIconView();
const sortController = new SortController(sortService, sortView, noteService);
sortController.initialize();

import { NoteController } from './controllers/note-controller.js';
import { NoteView } from './views/note-view.js';

const noteView = new NoteView();
const noteController = new NoteController(
    noteView,
    noteService,
    noteEditController,
    filterController,
    sortController);
await noteController.initialize();