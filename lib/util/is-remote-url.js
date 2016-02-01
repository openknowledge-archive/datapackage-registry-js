import url from 'url';

function isRemoteURL(path) {
  const parsedPath = url.parse(path);

  return parsedPath.protocol && parsedPath.protocol !== 'file:';
}

export default isRemoteURL;
