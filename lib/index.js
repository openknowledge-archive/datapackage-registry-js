import 'babel-polyfill';
import fs from 'fs';
import path from 'path';
import csv from 'csv';
import Promise from 'bluebird';
import 'isomorphic-fetch';

const DEFAULT_REGISTRY = Promise.promisify(csv.parse)(
  fs.readFileSync(path.join(__dirname, 'schemas', 'registry.csv'), 'utf8'),
  { columns: true }
);

class Registry {
  constructor(url = undefined) {
    if (!url) {
      this._registry = DEFAULT_REGISTRY;
    } else {
      this._url = url;
    }
  }

  get() {
    return this._getRegistry();
  }

  _getRegistry() {
    if (this._registry) return this._registry;

    this._registry = fetch(this._url)
                       .then((response) => {
                         if (response.status !== 200) {
                           throw new Error('Bad response from server');
                         }

                         return response.text();
                       })
                       .then((text, err) => {
                         if (err) {
                           throw err;
                         }

                         return Promise.promisify(csv.parse)(text, { columns: true });
                       });

    return this._registry;
  }
}

export default Registry;
