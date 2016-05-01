import path from 'path';
import fetchMock from 'fetch-mock';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.should();
chai.use(chaiAsPromised);

global.fetchMock = fetchMock;
global.fixturePath = (name) => path.join(__dirname, 'fixtures', name);
