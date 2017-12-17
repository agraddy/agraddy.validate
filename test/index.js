var path = require('path');
process.chdir(path.dirname(__filename));
var tap = require('agraddy.test.tap')(__filename);

var mod = require('../');

tap.assert.equal(typeof mod, 'function', 'Should be equal.');


