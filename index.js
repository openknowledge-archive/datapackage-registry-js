var _ = require('underscore');
var csv = require('csv');
var Promise = require('bluebird');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var config = {
  backend: 'https://rawgit.com/dataprotocols/registry/master/registry.csv',
  objectwise: true
};


function getCSVEndpoint(endpoint, objectwise) {
  /**
   * Return data from an endpoint that is parsable as CSV
   */

  return new Promise(function(resolve, reject) {
    fetch(endpoint).
        then(function(response) {
          if (response.status != 200) {
            reject("Bad response from server");
          }
          return response.text();
        }).then(function(text){
          csv.parse(text, {columns: objectwise}, function(error, output) {
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
  var customConfig = _.extend(config, userConfig);
  return getCSVEndpoint(customConfig.backend, customConfig.objectwise);
}


module.exports = {
    get: getRegistry
};
