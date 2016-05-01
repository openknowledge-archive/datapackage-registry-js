import path from 'path';
import readFileOrURL from '../../lib/util/read-file-or-url';
import isBrowser from '../../lib/util/is-browser';

describe('#readFileOrUrl', () => {
  describe('url', () => {
    const URL = 'http://okfn.org';
    const DATA = 'foo';

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return the data', () => {
      fetchMock.mock(URL, DATA);

      return readFileOrURL(URL).should.eventually.equal(DATA);
    });

    it('should throw an error if unable to get the URL', () => {
      fetchMock.mock(URL, 500);

      return readFileOrURL(URL).should.eventually.be.rejected;
    });
  });

  if (!isBrowser) {
    // We only read files when in NodeJS

    describe('file', () => {
      const PATH = path.join(__dirname, '..', 'fixtures', 'foo.txt');
      const DATA = 'foo\n';

      it('should return the data', () => readFileOrURL(PATH).should.eventually.equal(DATA));

      it('should throw an error if unable to read the file', () => {
        const inexistentPath = 'this-file-shouldnt-exist';
        return readFileOrURL(inexistentPath).should.eventually.be.rejected;
      });
    });
  }
});
