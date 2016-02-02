# Data Package Registry

[![Travis Build Status](https://travis-ci.org/okfn/datapackage-registry-js.svg?branch=master)](https://travis-ci.org/okfn/datapackage-registry-js)
[![Coveralls](http://img.shields.io/coveralls/okfn/datapackage-registry-js.svg?branch=master)](https://coveralls.io/r/okfn/datapackage-registry-js?branch=master)

Polyfills have been used:
es6-promise

## Usage

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

## Developer notes

These notes are intended to help people that want to contribute to this
package itself. If you just want to use it, you can safely ignore this.

### Updating the local schemas cache

We cache the schemas from <https://github.com/dataprotocols/schemas> using
git-subtree. To update it, use:

    git subtree pull --prefix schemas https://github.com/dataprotocols/schemas.git master --squash
