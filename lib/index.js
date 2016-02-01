import 'babel-polyfill';
import csv from 'csv';
import Promise from 'bluebird';
import path from 'path';
import readFileOrURL from './util/read-file-or-url';
import isBrowser from './util/is-browser';
import isRemoteURL from './util/is-remote-url';

const DEFAULT_REGISTRY_PATH = (isBrowser) ? 'http://schemas.datapackages.org/registry.csv' :
                                            path.join(__dirname, 'schemas', 'registry.csv');

class Registry {
  constructor(pathOrURL = DEFAULT_REGISTRY_PATH) {
    this._registry = this._loadRegistry(pathOrURL);
    this._base_path = this._loadBasePath(pathOrURL);
  }

  getProfiles() {
    return this._registry;
  }

  getBasePath() {
    return this._base_path;
  }

  get(profileId) {
    return this.getProfiles()
             .then((registry) => registry[profileId])
             .then((profile) => this._loadProfile(profile));
  }

  _loadRegistry(pathOrURL) {
    return readFileOrURL(pathOrURL)
             .then((text) => Promise.promisify(csv.parse)(text, { columns: true }))
             .then((registry) => this._groupProfilesById(registry));
  }

  _loadBasePath(pathOrURL) {
    if (!isBrowser && !isRemoteURL(pathOrURL)) {
      return path.dirname(path.resolve(pathOrURL));
    }
  }

  _loadProfile(profile) {
    if (!profile) {
      return undefined;
    }

    let profilePath;

    if (!isBrowser && this.getBasePath() && profile.schema_path) {
      profilePath = path.join(this.getBasePath(), profile.schema_path);
    } else {
      profilePath = profile.schema;
    }

    return readFileOrURL(profilePath)
             .then((text) => JSON.parse(text));
  }

  _groupProfilesById(registry) {
    const grouppedRegistry = {};

    for (const profile of registry) {
      grouppedRegistry[profile.id] = profile;
    }

    return grouppedRegistry;
  }
}

export default Registry;
