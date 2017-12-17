var path = require('path');
process.chdir(path.dirname(__filename));
var tap = require('agraddy.test.tap')(__filename);
var util = require('util');

var mod = require('../');

var item = 'test';

// TODO: Eventually use mod.setup to fail on first or return all failures

// Aliases
tap.assert.deepEqual(mod.equal, mod.equals, true, 'equal and equals should be the same.');
tap.assert.deepEqual(mod.int, mod.integer, true, 'equal and equals should be the same.');

// Basic boolean result
tap.assert.equal(mod(item, 'Item', pass, Boolean), true, 'Should return a Boolean.');
tap.assert.equal(mod(item, 'Item', fail, Boolean), false, 'Should return a Boolean.');
tap.assert.equal(mod(item, 'Item', pass, pass, Boolean), true, 'Should return a Boolean.');
tap.assert.equal(mod(item, 'Item', pass, fail, Boolean), false, 'Should return a Boolean.');

// Basic string result
tap.assert.equal(mod(item, 'Item', pass, String), '', 'Should return an empty string.');
tap.assert.equal(mod(item, 'Item', fail, String), 'Item Fail', 'Should return a string.');
tap.assert.equal(mod(item, 'Item', pass, pass, String), '', 'Should return an empty string.');
tap.assert.equal(mod(item, 'Item', pass, fail, String), 'Item Fail', 'Should return a string.');
tap.assert.equal(mod(item, 'Item', fail, fail, String), 'Item Fail Item Fail', 'Should return a string.');
tap.assert.equal(mod(item, 'Item', fail, fail, String, '|'), 'Item Fail|Item Fail', 'Should return an empty string.');

// Basic array result
tap.assert.deepEqual(mod(item, 'Item', pass, Array), [], 'Should return an empty array.');
tap.assert.deepEqual(mod(item, 'Item', fail, Array), ['Item Fail'], 'Should return an array.');
tap.assert.deepEqual(mod(item, 'Item', pass, pass, Array), [], 'Should return an empty array.');
tap.assert.deepEqual(mod(item, 'Item', pass, fail, Array), ['Item Fail'], 'Should return an array.');
tap.assert.deepEqual(mod(item, 'Item', fail, fail, Array), ['Item Fail', 'Item Fail'], 'Should return an array.');

// Basic callback result
mod(item, 'Item', pass, function(err, result) {
	tap.assert.equal(result.boolean, true, 'Should return a Boolean.');
	tap.assert.equal(result.string, '', 'Should return an empty string.');
	tap.assert.deepEqual(result.array, [], 'Should return an empty array.');
});
mod(item, 'Item', fail, function(err, result) {
	tap.assert.equal(result.boolean, false, 'Should return a Boolean.');
	tap.assert.equal(result.string, 'Item Fail', 'Should return a string.');
	tap.assert.deepEqual(result.array, ['Item Fail'], 'Should return an array.');
});
mod(item, 'Item', pass, pass, function(err, result) {
	tap.assert.equal(result.boolean, true, 'Should return a Boolean.');
	tap.assert.equal(result.string, '', 'Should return an empty string.');
	tap.assert.deepEqual(result.array, [], 'Should return an empty array.');
});
mod(item, 'Item', pass, fail, function(err, result) {
	tap.assert.equal(result.boolean, false, 'Should return a Boolean.');
	tap.assert.equal(result.string, 'Item Fail', 'Should return a string.');
	tap.assert.deepEqual(result.array, ['Item Fail'], 'Should return an array.');
});
mod(item, 'Item', fail, fail, function(err, result) {
	tap.assert.equal(result.boolean, false, 'Should return a Boolean.');
	tap.assert.equal(result.string, 'Item Fail Item Fail', 'Should return a string.');
	tap.assert.deepEqual(result.array, ['Item Fail', 'Item Fail'], 'Should return an array.');
});
mod(item, 'Item', fail, fail, function(err, result) {
	tap.assert.equal(result.boolean, false, 'Should return a Boolean.');
	tap.assert.equal(result.string, 'Item Fail|Item Fail', 'Should return a string.');
	tap.assert.deepEqual(result.array, ['Item Fail', 'Item Fail'], 'Should return an array.');
}, '|');

// Handle custom message
tap.assert.equal(mod(item, 'Item', fail, '%s FAILED', String), 'Item FAILED', 'Should return a custom message.');

// validate.required working
tap.assert.equal(mod('', 'Item', mod.required, Boolean), false, 'validate.required working.');
tap.assert.equal(mod(null, 'Item', mod.required, Boolean), false, 'validate.required working.');
tap.assert.equal(mod(false, 'Item', mod.required, Boolean), false, 'validate.required working.');
tap.assert.equal(mod(0, 'Item', mod.required, Boolean), true, 'validate.required working.');

// validate.numeric working
tap.assert.equal(mod('', 'Item', mod.numeric, Boolean), false, 'validate.numeric working.');
tap.assert.equal(mod(null, 'Item', mod.numeric, Boolean), false, 'validate.numeric working.');
tap.assert.equal(mod(false, 'Item', mod.numeric, Boolean), false, 'validate.numeric working.');
tap.assert.equal(mod(0, 'Item', mod.numeric, Boolean), true, 'validate.numeric working.');

// validate.equal working
tap.assert.equal(mod('one', 'Item', mod.equal('two'), Boolean), false, 'validate.equal working.');
tap.assert.equal(mod('three', 'Item', mod.equal('three'), Boolean), true, 'validate.equal working.');
tap.assert.equal(mod('four', 'Item', mod.equal('five', 'six'), Boolean), false, 'validate.equal working.');
tap.assert.equal(mod('eight', 'Item', mod.equal('seven', 'eight'), Boolean), true, 'validate.equal working.');

// validate.length working
tap.assert.equal(mod('one', 'Item', mod.len(3), Boolean), true, 'validate.len working.');
tap.assert.equal(mod('one', 'Item', mod.len(2), Boolean), false, 'validate.len working.');
tap.assert.equal(mod(1, 'Item', mod.len(3), Boolean), false, 'validate.len working.');
tap.assert.equal(mod(['one'], 'Item', mod.len(1), Boolean), true, 'validate.len working.');

// validate.min working
tap.assert.equal(mod('one', 'Item', mod.min(3), Boolean), true, 'validate.min working.');
tap.assert.equal(mod('on', 'Item', mod.min(3), Boolean), false, 'validate.min working.');
tap.assert.equal(mod(3, 'Item', mod.min(3), Boolean), true, 'validate.min working.');
tap.assert.equal(mod(2, 'Item', mod.min(3), Boolean), false, 'validate.min working.');

// validate.max working
tap.assert.equal(mod('one', 'Item', mod.max(3), Boolean), true, 'validate.max working.');
tap.assert.equal(mod('one!', 'Item', mod.max(3), Boolean), false, 'validate.max working.');
tap.assert.equal(mod(3, 'Item', mod.max(3), Boolean), true, 'validate.max working.');
tap.assert.equal(mod(4, 'Item', mod.max(3), Boolean), false, 'validate.max working.');

// validate.int working
tap.assert.equal(mod('', 'Item', mod.int, Boolean), false, 'validate.int working.');
tap.assert.equal(mod(null, 'Item', mod.int, Boolean), false, 'validate.int working.');
tap.assert.equal(mod(false, 'Item', mod.int, Boolean), false, 'validate.int working.');
tap.assert.equal(mod(0, 'Item', mod.int, Boolean), true, 'validate.int working.');
tap.assert.equal(mod(10.3, 'Item', mod.int, Boolean), false, 'validate.int working.');
tap.assert.equal(mod(10, 'Item', mod.int, Boolean), true, 'validate.int working.');

// Throw error with info when validator does not exist.
// TODO: Callback with erro when validator does not exist.
try {
	mod(10, 'Item', mod.doesNotExist, Boolean);
} catch(e) {
	tap.assert.equal(true, true, 'Throw error when validator does not exist.');
}


function fail(item, name, message, type) {
	var bool = true;
	var msg = '%s Fail';
	if(message) {
		msg = message;
	}

	bool = false;
	return mod.result(bool, util.format(msg, name), type);

	/*
	if(type === String || type === Array) {
		return util.format(msg, name);
	} else if(type === Boolean) {
		return false;
	} else if(typeof type == 'function') {
		type(null, util.format(msg, name));
	} else {
		return false;
	}
	*/
}
function pass(item, name, message, type) {
	if(type === String || type === Array) {
		return '';
	} else if(type === Boolean) {
		return true;
	} else if(typeof type == 'function') {
		type(null, '');
	} else {
		return true;
	}
}
