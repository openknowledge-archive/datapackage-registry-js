import fetchMock from 'fetch-mock';
import Registry from '..';
import chai from 'chai';
chai.should();

describe('Data Package Registry', () => {
  const CONFIG = {
    backend: 'http://schemas.datapackages.org/registry.csv',
  };

  describe('get()', () => {
    it('return Promise object', () => {
      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification');

      const registry = new Registry(CONFIG.backend);

      registry.get().then.should.be.not.undefined;
    });

    it('resolve into non-empty array of objects when registry is not empty', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification\n1,2,3,4');

      const registry = new Registry(CONFIG.backend);

      registry.get().then((data) => {
        data.should.be.not.empty;
        done();
      });
    });

    it('resolve into empty array when registry is empty', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification');

      const registry = new Registry(CONFIG.backend);

      registry.get().then((data) => {
        data.should.be.empty;
        done();
      });
    });

    it('reject when connection fails', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 500);

      const registry = new Registry(CONFIG.backend);

      registry.get().catch(() => {
        done();
      });
    });

    it('caches the registry after the first load', (done, err) => {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification\n1,2,3,4');

      const registry = new Registry(CONFIG.backend);

      registry.get().then(() => {
        fetchMock.restore();
        fetchMock.mock(CONFIG.backend, 500);

        registry.get().then(() => {
          done();
        });
      });
    });
  });
});
