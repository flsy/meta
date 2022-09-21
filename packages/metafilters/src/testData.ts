import { getDatabase, prepare, run } from './sqliteUtils';

export const exampleColumn = ['id', 'firstName', 'lastName', 'age', 'isValid'];

export const seed = async () => {
    const db = await getDatabase(':memory:');

    await run(db, 'CREATE TABLE "person-dash" (id INT, firstName VARCHAR, lastName VARCHAR, age NUMBER, isValid BOOLEAN)');
    await prepare(db, 'INSERT INTO "person-dash" VALUES (?, ?, ?, ?, ?)', [
        [1, 'Joe', 'Forest', 52, false],
        [2, 'Alpha', 'Tree', 2, true],
        [3, 'Beta', 'Woods', 30, true],
        [5, 'Carol', 'RainForest', 18, true],
    ]);

    return db;
};
