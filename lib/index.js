import 'babel-polyfill';
import _ from 'underscore';
import fs from 'fs';
import path from 'path';
import csv from 'csv';
import Promise from 'bluebird';
import 'isomorphic-fetch';

const DEFAULT_REGISTRY = Promise.promisify(csv.parse)(
  fs.readFileSync(path.join(__dirname, 'schemas', 'registry.csv'), 'utf8'),
  {columns: true}
);

let schemas = {
  base: JSON.parse(fs.readFileSync(path.join(__dirname, 'schemas', 'data-package.json'), 'utf8')),
  tabular: JSON.parse(fs.readFileSync(path.join(__dirname, 'schemas', 'tabular-data-package.json'), 'utf8')),
  fiscal: JSON.parse(fs.readFileSync(path.join(__dirname, 'schemas', 'fiscal-data-package.json'), 'utf8')),
}

class Registry {
  constructor(url=undefined) {
    if (!url) {
      this._registry = DEFAULT_REGISTRY;
    } else {
      this._url = url;
    }
  }

  get() {
    return this._get_registry();
  }

  _get_registry() {
    if (this._registry) return this._registry;

    this._registry = fetch(this._url)
                       .then((response) => {
                         if (response.status != 200) {
                           throw new Error('Bad response from server');
                         }

                         return response.text();
                       })
                       .then((text, err) => {
                         if (err) {
                           throw err;
                         }

                         return Promise.promisify(csv.parse)(text, {columns: true});
                       });

    return this._registry;
  }
}

export default Registry;
