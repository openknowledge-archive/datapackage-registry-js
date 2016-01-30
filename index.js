import 'babel-polyfill';
import _ from 'underscore';
import csv from 'csv';
import Promise from 'bluebird';
import 'isomorphic-fetch';

const DEFAULT_REGISTRY_URL = 'http://schemas.datapackages.org/registry.csv';

class Registry {
  constructor(url=DEFAULT_REGISTRY_URL) {
    this.url = url;
  }

  get() {
    return fetch(this.url)
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
  }
}

export default Registry;
