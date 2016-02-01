import url from 'url';
import isBrowser from './is-browser';
import Promise from 'bluebird';
import 'isomorphic-fetch';

let fs;
if (!isBrowser()) {
  fs = require('fs');
}

function _isRemoteURL(path) {
  const parsedPath = url.parse(path);

  return parsedPath.protocol && parsedPath.protocol !== 'file:';
}

function _readURL(_url) {
  return fetch(_url).then((response) => {
    if (!response.ok) {
      throw new Error('Bad response from server');
    }
    return response.text();
  });
}

function _readFile(path) {
  // WARN: This only works on NodeJS
  return Promise.promisify(fs.readFile)(path, 'utf8');
}

function readFileOrURL(pathOrURL) {
  let result;
  if (isBrowser() || _isRemoteURL(pathOrURL)) {
    result = _readURL(pathOrURL);
  } else {
    result = _readFile(pathOrURL);
  }
  return result;
}

export default readFileOrURL;
