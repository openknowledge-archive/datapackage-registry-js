# Data Package Registry

[![Travis Build Status](https://travis-ci.org/okfn/datapackage-registry-js.svg?branch=master)](https://travis-ci.org/okfn/datapackage-registry-js)
[![Coveralls](http://img.shields.io/coveralls/okfn/datapackage-registry-js.svg?branch=master)](https://coveralls.io/r/okfn/datapackage-registry-js?branch=master)

Polyfills have been used:
es6-promise

## Usage

```javascript
var Registry = require('datapackage-registry');

// Without parameters, this will use the default registry (http://schemas.datapackages.org/registry.csv)
// When using in NodeJS, this registry is locally cached, so no HTTP requests will de done.
var registry = new Registry();

// See the list of profiles available in the registry
registry.getProfiles()
        .then(function (profiles) {
          console.log(profiles);
          // {
          //   base:
          //    { id: 'base',
          //      title: 'Data Package',
          //      schema: 'http://schemas.datapackages.org/data-package.json',
          //      schema_path: 'data-package.json',
          //      specification: 'http://dataprotocols.org/data-packages' },
          //   tabular:
          //    { id: 'tabular',
          //      title: 'Tabular Data Package',
          //      schema: 'http://schemas.datapackages.org/tabular-data-package.json',
          //      schema_path: 'tabular-data-package.json',
          //      specification: 'http://dataprotocols.org/tabular-data-package/' },
          //   fiscal:
          //    { id: 'fiscal',
          //      title: 'Fiscal Data Package',
          //      schema: 'http://schemas.datapackages.org/fiscal-data-package.json',
          //      schema_path: 'fiscal-data-package.json',
          //      specification: 'http://fiscal.dataprotocols.org/spec/' }
          // }
        });

// Get a profile
registry.get('base')
        .then(function (profile) {
          // use profile
        })
        .catch(function (err) {
          // deal with error
        });
```

## Developer notes

These notes are intended to help people that want to contribute to this
package itself. If you just want to use it, you can safely ignore this.

### Updating the local schemas cache

We cache the schemas from <https://github.com/dataprotocols/schemas> using
git-subtree. To update it, use:

    git subtree pull --prefix schemas https://github.com/dataprotocols/schemas.git master --squash
