import 'babel-polyfill';
import csv from 'csv';
import Promise from 'bluebird';
import readFileOrURL from './util/read-file-or-url';

const DEFAULT_REGISTRY_URL = 'http://schemas.datapackages.org/registry.csv';

class Registry {
  constructor(url = DEFAULT_REGISTRY_URL) {
    this._url = url;
  }

  get() {
    return this._getRegistry();
  }

  _getRegistry() {
    if (this._registry) return this._registry;

    this._registry = readFileOrURL(this._url)
                       .then((text) => Promise.promisify(csv.parse)(text, { columns: true }));

    return this._registry;
  }
}

export default Registry;
