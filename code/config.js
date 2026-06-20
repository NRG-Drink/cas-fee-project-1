import path from 'path';

export const ROOT = path.resolve("code");

export const CONFIG = {
    root: ROOT,
    data: (dbName) => path.join(ROOT, 'data', dbName),
    public: path.join(ROOT, 'public'),
    publicCombined: (dbName) => path.join(ROOT, 'data', dbName),
};