import isBrowser from '../lib/util/is-browser';
import Registry from '..';

describe('Data Package Registry', () => {
  const CONFIG = {
    backend: 'http://schemas.datapackages.org/registry.csv',
  };

  afterEach(() => {
    fetchMock.restore();
  });

  describe('#get', () => {
    it('resolve into non-empty array of objects when registry is not empty', () => {
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification\n1,2,3,4');

      const registry = new Registry(CONFIG.backend);

      return registry.get().should.eventually.be.not.empty;
    });

    it('resolve into empty array when registry is empty', () => {
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification');

      const registry = new Registry(CONFIG.backend);

      return registry.get().should.eventually.be.empty;
    });

    it('reject when connection fails', () => {
      fetchMock.mock(CONFIG.backend, 500);

      const registry = new Registry(CONFIG.backend);

      return registry.get().should.eventually.be.rejected;
    });

    it('caches the registry after the first load', () => {
      fetchMock.mock(CONFIG.backend, 'id,title,schema,specification\n1,2,3,4');

      const registry = new Registry(CONFIG.backend);

      return registry.get()
               .then(() => {
                 fetchMock.restore();
                 fetchMock.mock(CONFIG.backend, 500);

                 return registry.get().should.eventually.be.fulfilled;
               });
    });
  });

  if (isBrowser) {
    describe('in Browser', () => {
      describe('#get', () => {
        it('uses the remote registry by default', () => {
          fetchMock.mock(CONFIG.backend, 'id,title,schema,specification\n1,2,3,4');
          const registry = new Registry();

          return registry.get()
                   .then(() => {
                     fetchMock.called(CONFIG.backend).should.be.true;
                   });
        });
      });
    });
  } else {
    describe('in NodeJS', () => {
      describe('#get', () => {
        it('uses the local cache by default', () => {
          fetchMock.mock('.*', 500);
          const registry = new Registry();

          return registry.get().should.eventually.be.not.empty;
        });

        it('accepts a local registry', () => {
          const path = fixturePath('base_and_tabular_registry.csv');
          const registry = new Registry(path);

          return registry.get().should.eventually.be.not.empty;
        });
      });
    });
  }
});
