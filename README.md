# Data Package Registry

[![Travis Build Status](https://travis-ci.org/okfn/datapackage-registry-js.svg?branch=master)](https://travis-ci.org/okfn/datapackage-registry-js)
[![Coveralls](http://img.shields.io/coveralls/okfn/datapackage-registry-js.svg?branch=master)](https://coveralls.io/r/okfn/datapackage-registry-js?branch=master)

Polyfills have been used:
es6-promise

# Usage

```javascript
var registry = require('datapackage-registry')('http://schemas.datapackages.org/registry.csv')

registry.get('base')
        .then(function (schema) {
          // use schema
        });
        .catch(function (err) {
          // deal with error
        }
```
