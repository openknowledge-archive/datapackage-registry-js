import 'babel-polyfill';
import _ from 'underscore';
import csv from 'csv';
import Promise from 'bluebird';
import 'isomorphic-fetch';

const CONFIG = {
  backend: 'http://schemas.datapackages.org/registry.csv',
  objectwise: true,
};

function getCSVEndpoint(endpoint, objectwise) {
  /**
   * Return data from an endpoint that is parsable as CSV
   */

  return new Promise(function(resolve, reject) {
    fetch(endpoint).
        then(function(response) {
          if (response.status != 200) {
            reject('Bad response from server');
          }

          return response.text();
        }).then((text) => {
          csv.parse(text, {columns: objectwise}, (error, output) => {
            if (error) {
              reject('Failed to parse registry file: ' + error);
            }

            resolve(output);
          });
        });
  });
}

function getRegistry(userConfig) {
  /**
   * Return the DataPackage Registry as an array of objects
   */

  // Replace default params with user config
  var customConfig = _.extend(CONFIG, userConfig);
  return getCSVEndpoint(customConfig.backend, customConfig.objectwise);
}

export default {
  get: getRegistry,
};
