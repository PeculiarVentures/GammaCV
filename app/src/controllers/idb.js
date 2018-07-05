/**
 * @author Arkadiy Pilguk
 * @author Mikhail Zachepilo <mihailzachepilo@gmail.com>
 * @version 1.2.0
 */

/* eslint-disable no-param-reassign */

/**
 * @typedef {Object} ObjectWithID
 * @type {Object}
 * @property {string} id
 */

/**
 * @typedef {Object} ModelSchema
 * @type {Object}
 * @property {string} name
 */

import '../utils/object_omit_pluck';

const connections = ['Transaction'];
const connectionsVersion = {};
const createIndexes = {};

/**
 * @type {{
 *  Transaction: IDBWrapper,
 * }}
 */
export const IDB = {};

// Helper functions

/**
 * @param request
 * @returns {Promise|Promise<T>}
 */
function makePromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Iterate all records in objectStore
 * @param {IDBObjectStore} objectStore
 * @param {function<object, number>} callback - function to be called with each object
 * @param {IDBKeyRange} [keyRange]
 * @param {string} [indexKey]
 * @param {string} [direction]
 * @return {Promise<T>|Promise}
 */
function forEach(objectStore, callback, keyRange, indexKey, direction) {
  let i = 0;
  return new Promise((resolve, reject) => {
    let request;
    if (indexKey) {
      const index = objectStore.index(indexKey);
      request = index.openCursor(keyRange || null, direction);
    } else {
      request = objectStore.openCursor(keyRange, direction);
    }
    request.onsuccess = () => {
      const cursor = request.result;

      if (cursor) {
        callback(cursor.value, i);
        i += 1;
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = reject;
  });
}

// Public API

/**
 * @param {ModelSchema} schema
 * @param data
 */
export function saveRecord(schema, data) {
  return IDB[schema.name].put(data);
}

export function saveModel(model) {
  return IDB[model.schema.name].put(model.getForIDB());
}

/**
 * @param {ModelSchema} schema
 * @param data
 */
export function readRecord(schema, id) {
  return IDB[schema.name].get(id);
}

/**
 * @param {ModelSchema} schema
 * @param data
 */
export function deleteRecord(schema, id) {
  return IDB[schema.name].remove(id);
}

/**
 * @param {ModelSchema} schema
 */
export function readAllRecords(schema) {
  return IDB[schema.name].getAll();
}

/**
 * @param {ModelSchema} schema
 */
export function clear(schema) {
  return IDB[schema.name].clear();
}

/**
 * @param {ModelSchema} schema
 */
export function clearAll() {
  return Promise.all(connections.map(name => IDB[name].clear()));
}

/**
 * @param {string} connection
 */
export function clearSpace(connection) {
  const tasks = [];
  if (connection !== 'File') {
    tasks.push(IDB.File.clear());
  }
  tasks.push(smartClear() // eslint-disable-line
    .then(num => num || clearAll()));

  return Promise.all(tasks)
    .then(() => true);
}

/**
 * Clear object from internal info
 * @param {*} v
 * @return {*}
 */
function processReadObject(v) {
  if (typeof v === 'object') {
    return v.omit('[[wrote]]');
  }
  return v;
}

let FIREFOX_INCOGNITO_MODE;

/**
 * @class IDBWrapper
 */
export default class IDBWrapper {
  /**
   * @param {string} name - connection name
   */
  constructor(name) {
    this.name = name;
    this.version = connectionsVersion[name] || 1;
    if (!this.isSupporting()) {
      throw new Error("IDB don't supported by browser");
    }
    if (FIREFOX_INCOGNITO_MODE) {
      this.connection = this.handleErrors();
    } else {
      this.connection = this.openConnection(name)
        .then(::this.handleErrors)
        .catch((err) => {
          console.warn('Unable to open IDB connection', err);
          if (err.name === 'InvalidStateError') {
            FIREFOX_INCOGNITO_MODE = true;
          }
        });
    }
  }

  // TODO: post IDB connection errors to Rollbar

  handleErrors(db) {
    if (!db) {
      throw 'Connection is not opened'; // eslint-disable-line
    }
    db.onversionchange = (e) => {
      console.warn('Version changed in other tab', e);
      db.close();
    };
    db.onerror = err => console.warn(`IDB connection "${this.name}" error`, err);
    db.onclose = (err) => {
      console.warn(`IDB connection "${this.name}" was closed, restoring...`, err);
      this.connection = this.openConnection(this.name)
        .then(::this.handleErrors);
    };
    db.onabort = err => console.warn(`IDB connection "${this.name}" was aborted`, err);
    return db;
  }

  /**
   * @returns {boolean}
   */
  isSupporting() {
    this.IDB =
      window.indexedDB
      || window.mozIndexedDB
      || window.webkitIndexedDB
      || window.msIndexedDB;
    this.IDBTransaction =
      window.IDBTransaction
      || window.webkitIDBTransaction
      || window.msIDBTransaction;
    this.IDBKeyRange =
      window.IDBKeyRange
      || window.webkitIDBKeyRange
      || window.msIDBKeyRange;
    if (this.IDB) {
      return true;
    }
    return false;
  }

  /**
   * @param {string} connectionName
   * @returns {Promise|Promise<T>}
   */
  openConnection(connectionName) {
    let request;
    return new Promise((resolve, reject) => {
      try {
        request = this.IDB.open(this.name, this.version);
      } catch (err) {
        console.warn(err);
        reject(err);
      }

      request.onblocked = e => console.warn('DB Connection opening blocked', e);

      request.onupgradeneeded = (e) => {
        const db = e.currentTarget.result;
        try {
          db.deleteObjectStore(connectionName);
        } catch (err) {
          console.warn('Unable to delete Object Store (normal warning for first load or incognito)', err);
        }
        const objectStore = db.createObjectStore(connectionName, { keyPath: 'id' });
        if (typeof createIndexes[connectionName] === 'function') {
          createIndexes[connectionName](objectStore);
        }
      };

      makePromise(request)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * @param {function} callback
   * @param {IDBKeyRange} [keyRange]
   * @param {string} [indexKey]
   * @param {string} [direction]
   * @return {Promise.<T>|Promise}
   */
  iterate(callback, keyRange, indexKey, direction) {
    return this.connection.then((db) => {
      if (!db) {
        throw 'Connection is not opened'; // eslint-disable-line
      }
      const transaction = db.transaction([this.name], 'readwrite');
      const objectStore = transaction.objectStore(this.name);

      return forEach(objectStore, callback, keyRange, indexKey, direction);
    });
  }

  /**
   * @param {ObjectWithID} data
   * @returns {Promise|Promise<T>}
   */
  put(data) {
    return new Promise((resolve, reject) => {
      this.connection.then((db) => {
        if (!db) {
          throw 'Connection is not opened'; // eslint-disable-line
        }
        const transaction = db.transaction([this.name], 'readwrite');
        const objectStore = transaction.objectStore(this.name);
        const _data = { ...data, '[[wrote]]': Date.now() };
        const request = objectStore.put(_data);

        makePromise(request)
          .then(resolve)
          .catch((error) => {
            if (error && error.name === 'QuotaExceededError') {
              clearSpace(this.name)
                .then(() => this.put(_data))
                .then(resolve)
                .catch(reject);
            } else {
              reject({
                message: `Undefined record - ${data.id}.`,
                code: 404,
                source: error,
              });
            }
          });
      });
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<ObjectWithID>|Promise<T>}
   */
  get(id) {
    return new Promise((resolve, reject) => {
      this.connection.then((db) => {
        if (!db) {
          throw 'Connection is not opened'; // eslint-disable-line
        }
        const transaction = db.transaction([this.name], 'readonly');
        const objectStore = transaction.objectStore(this.name);
        const request = objectStore.get(id);

        makePromise(request)
          .then(result => resolve(processReadObject(result)))
          .catch(() => reject({
            message: `Undefined record - ${id}.`,
            code: 404,
          }));
      }).catch(reject);
    });
  }

  /**
   * @param {id} id
   * @returns {Promise|Promise<T>}
   */
  remove(id) {
    return new Promise((resolve, reject) => {
      this.connection.then((db) => {
        if (!db) {
          throw 'Connection is not opened'; // eslint-disable-line
        }
        const transaction = db.transaction([this.name], 'readwrite');
        const objectStore = transaction.objectStore(this.name);
        const request = objectStore.delete(id);

        makePromise(request)
          .then(resolve)
          .catch(() => reject({
            message: `Undefined record - ${id}.`,
            code: 404,
          }));
      }).catch(reject);
    });
  }

  /**
   * @param {Array} ids
   * @returns {Promise|Promise<T>}
   */
  removeMultiple(ids) {
    return new Promise((resolve, reject) => {
      this.connection.then((db) => {
        if (!db) {
          throw 'Connection is not opened'; // eslint-disable-line
        }
        const transaction = db.transaction([this.name], 'readwrite');
        const objectStore = transaction.objectStore(this.name);
        const promises = ids.map(id =>
          new Promise((_resolve) => {
            const request = objectStore.delete(id);

            makePromise(request)
              .then(_resolve)
              .catch(() => _resolve(false));
          }));
        Promise.all(promises).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  /**
   * @returns {Promise|Promise<T>}
   */
  getAll() {
    const list = [];
    return new Promise((resolve, reject) => {
      const callback = value => list.push(processReadObject(value));
      this.connection.then((db) => {
        if (!db) {
          throw 'Connection is not opened'; // eslint-disable-line
        }
        const transaction = db.transaction([this.name], 'readonly');
        const objectStore = transaction.objectStore(this.name);
        return forEach(objectStore, callback);
      })
        .then(() => resolve(list))
        .catch(reject);
    });
  }

  /**
   * @returns {Promise|Promise<T>}
   */
  clear() {
    return new Promise((resolve, reject) => {
      this.connection.then((db) => {
        if (!db) {
          throw 'Connection is not opened'; // eslint-disable-line
        }
        const transaction = db.transaction([this.name], 'readwrite');
        const objectStore = transaction.objectStore(this.name);
        objectStore.clear().onsuccess = () => {
          resolve();
        };
      }).catch(reject);
    });
  }
}

// connections.forEach((name) => {
//   IDB[name] = new IDBWrapper(name);
// });
