import { Database } from 'sqlite3';
import * as sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

export const getDatabase = async (filename: string): Promise<Database> =>
  new Promise((resolve, reject) => {
    const db = new sqlite.Database(filename, (error) => {
      if (error) {
        // console.log("error", "cache get database", error.message);
        reject(error);
      }
      resolve(db);
    });
  });

export const run = (db: Database, sql: string, params: any[] = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, (err: Error, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const get = <T>(db: Database, sql: string, params: any[] = []): Promise<T> =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const prepare = (db: Database, sql: string, data: Array<Array<any>>) =>
  new Promise((resolve, reject) => {
    const stmt = db.prepare(sql, (e) => {
      if (e) {
        reject(e);
      }
      data.reduce<any>((al, current) => stmt.run(current), 0);

      stmt.finalize((error) => {
        if (error) {
          reject(error);
        }
        resolve(undefined);
      });
    });
  });

export const all = <T>(db: Database, sql: string, params: any[] = []): Promise<T[]> =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

export const close = async (db: Database) =>
  new Promise((resolve) => {
    db.close(() => resolve(true));
  });
