import type { AsyncStorage } from 'oidc-client-ts';

export default class IndexedDBStorage implements AsyncStorage {
  private db: IDBDatabase | undefined;
  private readonly dbName: string;
  private readonly storeName: string;

  public constructor(dbName = 'asyncStorage', storeName = 'keyval') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  public get length(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.transaction('readonly').then(
        (store) => {
          const request = store.count();

          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = () => {
            reject(this.convertDOMExceptionToError(request.error));
          };
        },
        (error: unknown) => {
          reject(
            error instanceof Error
              ? error
              : new Error('IndexedDBStorage initialization error'),
          );
        },
      );
    });
  }

  public async clear(): Promise<void> {
    const store = await this.transaction('readwrite');
    return new Promise<void>((resolve, reject) => {
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(this.convertDOMExceptionToError(request.error));
      };
    });
  }

  public async getItem(key: string): Promise<string | null> {
    const store = await this.transaction('readonly');
    return new Promise<string | null>((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = () => {
        resolve((request.result as string) || null);
      };
      request.onerror = () => {
        reject(this.convertDOMExceptionToError(request.error));
      };
    });
  }

  public async key(index: number): Promise<string | null> {
    const store = await this.transaction('readonly');
    return new Promise<string | null>((resolve, reject) => {
      const request = store.openKeyCursor();
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (cursor) {
          if (count === index) {
            resolve(cursor.key as string);
          } else {
            count++;
            cursor.continue();
          }
        } else {
          // Cursor is null, meaning we've reached the end
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(this.convertDOMExceptionToError(request.error));
      };
    });
  }

  public async removeItem(key: string): Promise<void> {
    const store = await this.transaction('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(this.convertDOMExceptionToError(request.error));
      };
    });
  }

  public async setItem(key: string, value: string): Promise<void> {
    const store = await this.transaction('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(this.convertDOMExceptionToError(request.error));
      };
    });
  }

  private async initialize() {
    this.db ??= await new Promise<IDBDatabase>((resolve, reject) => {
      const dbVersion = 1;
      const request = indexedDB.open(this.dbName, dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName);
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        const target = event.target as IDBOpenDBRequest;
        reject(this.convertDOMExceptionToError(target.error));
      };
    });
    return this.db;
  }

  private async transaction(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.initialize();
    const transaction = db.transaction(this.storeName, mode);
    return transaction.objectStore(this.storeName);
  }

  private convertDOMExceptionToError(event: DOMException | null): Error {
    return event instanceof DOMException
      ? new Error(event.message)
      : new Error('Unknown IndexedDB error');
  }
}
