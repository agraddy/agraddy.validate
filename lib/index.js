var util = require('util');

var mod = function() {
	var item = arguments[0];
	var name = arguments[1];
	var type = arguments[arguments.length - 1];
	var delimiter = ' ';
	var funcs = [];
	var arg_length = arguments.length - 1;
	var output;
	var result;
	var i;
	var index;
	var message;

	if(typeof type == 'string') {
		delimiter = type;

		type = arguments[arg_length - 1];
		arg_length = arg_length - 1;
	}

	for(i = 2; i < arg_length; i++) {
		if(typeof arguments[i + 1] == 'string') {
			message = arguments[i + 1];
		} else {
			message = null;
		}

		if(typeof arguments[i] != 'function') {
			throw(new Error('The validator at position ' + (i - 1) + ' does not exist.'));
		} else {
			funcs.push(arguments[i].bind(null, item, name, message));
		}

		if(message) {
			i++;
		}
	}

	if(type === Boolean) {
		output = true;
		for(i = 0; i < funcs.length; i++) {
			output = funcs[i](type);
			if(!output) {
				break;
			}
		}

		return output;
	} else if(type === String) {
		output = '';
		for(i = 0; i < funcs.length; i++) {
			if(output == '') {
				output += funcs[i](type);
			} else {
				output += delimiter + funcs[i](type);
			}
		}
		return output;
	} else if(type === Array) {
		output = [];
		result = '';
		for(i = 0; i < funcs.length; i++) {
			result = funcs[i](type);
			if(result) {
				output.push(result);
			}
		}
		return output;
	} else if(typeof type === 'function') {
		index = 0;
		output = {};
		output.boolean = true;
		output.string = '';
		output.array = [];
		aggregate(index, funcs, output, delimiter, type, null, null);
	} else {
		return new Error('There was a problem with validation.');
	}
}

mod.equal = function() {
	var args = [];
	var i;
	for(i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return function(item, name, message, type) {
		var msg = '%s must be a valid item.';
		var passed;
		if(message) {
			msg = message;
		}

		if(args.indexOf(item) == -1) {
			passed = false;
		} else {
			passed = true;
		}

		if(type === String || type === Array) {
			if(passed) {
				return '';
			} else {
				return util.format(msg, name);
			}
		} else if(type === Boolean) {
			return passed;
		} else if(typeof type == 'function') {
			if(passed) {
				type(null, '');
			} else {
				type(null, util.format(msg, name));
			}
		} else {
			return false;
		}
	}
}
mod.equals = mod.equal;

mod.integer = function(item, name, message, type) {
	var msg = '%s should be an integer.';
	var passed;
	if(message) {
		msg = message;
	}

	if(typeof item == 'number' && Math.round(item) === item) {
		passed = true;
	} else {
		passed = false;
	}

	if(type === String || type === Array) {
		if(passed) {
			return '';
		} else {
			return util.format(msg, name);
		}
	} else if(type === Boolean) {
		return passed;
	} else if(typeof type == 'function') {
		if(passed) {
			type(null, '');
		} else {
			type(null, util.format(msg, name));
		}
	} else {
		return false;
	}
}
mod.int = mod.integer;

mod.len = function(input) {
	return function(item, name, message, type) {
		var msg = '%s must be a valid item.';
		var passed;
		if(message) {
			msg = message;
		}

		if(typeof item.length == 'number' && item.length == input) {
			passed = true;
		} else {
			passed = false;
		}

		if(typeof item == 'string') {
			msg = '%s must have ' + input + ' characters.';
		}
		if(typeof item == 'array') {
			msg = '%s must have ' + input + ' items.';
		}

		if(type === String || type === Array) {
			if(passed) {
				return '';
			} else {
				return util.format(msg, name);
			}
		} else if(type === Boolean) {
			return passed;
		} else if(typeof type == 'function') {
			if(passed) {
				type(null, '');
			} else {
				type(null, util.format(msg, name));
			}
		} else {
			return false;
		}
	}
}

mod.max = function(input) {
	return function(item, name, message, type) {
		var msg = '%s must be a valid item.';
		var passed;
		if(message) {
			msg = message;
		}

		if(typeof item.length == 'number' && item.length <= input) {
			passed = true;
		} else if(typeof item == 'number' && item <= input) {
			passed = true;
		} else {
			passed = false;
		}

		if(typeof item == 'string') {
			msg = '%s must have at least ' + input + ' characters.';
		}
		if(typeof item == 'array') {
			msg = '%s must have at least ' + input + ' items.';
		}
		if(typeof item == 'number') {
			msg = '%s must be at least ' + input + ' items.';
		}

		if(type === String || type === Array) {
			if(passed) {
				return '';
			} else {
				return util.format(msg, name);
			}
		} else if(type === Boolean) {
			return passed;
		} else if(typeof type == 'function') {
			if(passed) {
				type(null, '');
			} else {
				type(null, util.format(msg, name));
			}
		} else {
			return false;
		}
	}
}

mod.min = function(input) {
	return function(item, name, message, type) {
		var msg = '%s must be a valid item.';
		var passed;
		if(message) {
			msg = message;
		}

		if(typeof item.length == 'number' && item.length >= input) {
			passed = true;
		} else if(typeof item == 'number' && item >= input) {
			passed = true;
		} else {
			passed = false;
		}

		if(typeof item == 'string') {
			msg = '%s must have at least ' + input + ' characters.';
		}
		if(typeof item == 'array') {
			msg = '%s must have at least ' + input + ' items.';
		}
		if(typeof item == 'number') {
			msg = '%s must be at least ' + input + ' items.';
		}

		if(type === String || type === Array) {
			if(passed) {
				return '';
			} else {
				return util.format(msg, name);
			}
		} else if(type === Boolean) {
			return passed;
		} else if(typeof type == 'function') {
			if(passed) {
				type(null, '');
			} else {
				type(null, util.format(msg, name));
			}
		} else {
			return false;
		}
	}
}

mod.numeric = function(item, name, message, type) {
	var msg = '%s should be a number.';
	var passed;
	if(message) {
		msg = message;
	}

	if(typeof item == 'number') {
		passed = true;
	} else {
		passed = false;
	}

	if(type === String || type === Array) {
		if(passed) {
			return '';
		} else {
			return util.format(msg, name);
		}
	} else if(type === Boolean) {
		return passed;
	} else if(typeof type == 'function') {
		if(passed) {
			type(null, '');
		} else {
			type(null, util.format(msg, name));
		}
	} else {
		return false;
	}
}

mod.required = function(item, name, message, type) {
	var msg = '%s is required.';
	var passed;
	if(message) {
		msg = message;
	}

	passed = Boolean(item);
	if(item === 0) {
		passed = true;
	}

	if(type === String || type === Array) {
		if(passed) {
			return '';
		} else {
			return util.format(msg, name);
		}
	} else if(type === Boolean) {
		return passed;
	} else if(typeof type == 'function') {
		if(passed) {
			type(null, '');
		} else {
			type(null, util.format(msg, name));
		}
	} else {
		return false;
	}
}

function aggregate(index, funcs, output, delimiter, cb, err, result) {
	if(index > 0) {
		if(result) {
			output.boolean  = false;
			if(output.string == '') {
				output.string += result;
			} else {
				output.string += delimiter + result;
			}
			output.array.push(result);
		}
	}
	if(index < funcs.length) {
		index++;
		funcs[index - 1](aggregate.bind(null, index, funcs, output, delimiter, cb));
	} else {
		cb(null, output);
	}
}

module.exports = mod;
