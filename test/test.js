import fetchMock from 'fetch-mock';
import Promise from 'bluebird';
import registry from '..';
import chai from 'chai';
chai.should()

describe('Data Package Registry', () => {
  const CONFIG = {
    backend: 'http://schemas.datapackages.org/registry.csv',
  };

  describe('get()', () => {
    it('return Promise object', (done, err) => {
      if (err) done(err);
      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification');

      registry.get().should.be.an.instanceOf(Promise);

      done();
    });

    it('resolve into non-empty array of objects when registry is not empty', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification\n1,2,3,4');

      registry.get().then((data) => {
        data.should.be.not.empty;
        done();
      });
    });

    it('resolve into empty array when registry is empty', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification');

      registry.get().then((data) => {
        data.should.be.empty;
        done();
      });
    });

    it('reject with a message when connection failed', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 500);

      registry.get().catch((error) => {
        error.should.be.a('string');
        done();
      });
    });
  });
});
