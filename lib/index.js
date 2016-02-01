import 'babel-polyfill';
import csv from 'csv';
import Promise from 'bluebird';
import 'isomorphic-fetch';

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
