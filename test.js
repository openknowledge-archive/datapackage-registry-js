var _ = require('underscore');
var fetchMock = require('fetch-mock');
var assert = require('chai').assert;
var Promise = require('bluebird');
var registry = require('./');
var should = require('chai').should();

describe('Data Package Registry', function() {
  var config = {
    backend: 'http://schemas.datapackages.org/registry.csv',
  };

  describe('get()', function() {
    it('return Promise object', function(done, err) {
      if (err) done(err);
      fetchMock.restore();
      fetchMock.mock(config.backend, 'id,title,schema,specification');

      registry.get().should.be.an.instanceOf(Promise);

      done();
    });

    it('resolve into non-empty array of objects when registry is not empty', function(done, err) {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(config.backend, 'id,title,schema,specification\n1,2,3,4');

      registry.get().then(function(data) {
        data.should.be.not.empty;
        done();
      });
    });

    it('resolve into empty array when registry is empty', function(done, err) {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(config.backend, 'id,title,schema,specification');

      registry.get().then(function(data) {
        data.should.be.empty;
        done();
      });
    });

    it('reject with a message when connection failed', function(done, err) {
      if (err) done(err);

      fetchMock.restore();
      fetchMock.mock(config.backend, 500);

      registry.get().catch(function(error) {
        error.should.be.a('string');
        done();
      });
    });
  });
});
