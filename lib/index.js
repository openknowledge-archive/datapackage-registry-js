import 'babel-polyfill';
import csv from 'csv';
import Promise from 'bluebird';
import path from 'path';
import readFileOrURL from './util/read-file-or-url';
import isBrowser from './util/is-browser';

const DEFAULT_REGISTRY_PATH = (isBrowser) ? 'http://schemas.datapackages.org/registry.csv' :
                                            path.join(__dirname, 'schemas', 'registry.csv');

class Registry {
  constructor(pathOrURL = DEFAULT_REGISTRY_PATH) {
    this._pathOrURL = pathOrURL;
  }

  get() {
    return this._getRegistry();
  }

  _getRegistry() {
    if (this._registry) return this._registry;

    this._registry = readFileOrURL(this._pathOrURL)
                       .then((text) => Promise.promisify(csv.parse)(text, { columns: true }));

    return this._registry;
  }
}

export default Registry;
