import readFileOrURL from '../../lib/util/read-file-or-url';
import isBrowser from '../../lib/util/is-browser';
import fetchMock from 'fetch-mock';
import path from 'path';
import chai from 'chai';
chai.should();

describe('#readFileOrUrl()', () => {
  describe('url', () => {
    const URL = 'http://okfn.org';
    const DATA = 'foo';

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return the data', (done) => {
      fetchMock.mock(URL, DATA);

      readFileOrURL(URL).then((data) => {
        data.should.equal(DATA);
        done();
      });
    });

    it('should throw an error if unable to get the URL', (done) => {
      fetchMock.mock(URL, 500);

      readFileOrURL(URL).then(() => {
        // do nothing
      }).catch(() => {
        done();
      });
    });
  });

  if (!isBrowser()) {
    // We only read files when in NodeJS

    describe('file', () => {
      const PATH = path.join(__dirname, '..', 'fixtures', 'foo.txt');
      const DATA = 'foo\n';

      it('should return the data', (done) => {
        readFileOrURL(PATH).then((data) => {
          data.should.equal(DATA);
          done();
        });
      });

      it('should throw an error if unable to read the file', (done) => {
        const inexistentPath = 'this-file-shouldnt-exist';

        readFileOrURL(inexistentPath).then(() => {
          // do nothing
        }).catch(() => {
          done();
        });
      });
    });
  }
});
