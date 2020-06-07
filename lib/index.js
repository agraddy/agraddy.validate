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

// Just do a simple email validation.
mod.email = function(item, name, message, type) {
	var msg = '%s should be a valid email.';
	var passed;
	if(message) {
		msg = message;
	}

    if(typeof item == 'string' && /\S+@\S+/.test(item)) {
		passed = true;
	} else {
		passed = false;
	}

	output = util.format(msg, name);
	return mod.result(passed, output, type);
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
		var output = '';
		if(message) {
			msg = message;
		}

		if(args.indexOf(item) == -1) {
			passed = false;
		} else {
			passed = true;
		}

		output = util.format(msg, name);
		return mod.result(passed, output, type);
	}
}
mod.equals = mod.equal;

mod.integer = function(item, name, message, type) {
	var msg = '%s should be a whole number.';
	var passed;
	if(message) {
		msg = message;
	}

	if(typeof item == 'number' && Math.round(item) === item) {
		passed = true;
	} else {
		passed = false;
	}

	output = util.format(msg, name);
	return mod.result(passed, output, type);
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


		output = util.format(msg, name);
		return mod.result(passed, output, type);
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

		output = util.format(msg, name);
		return mod.result(passed, output, type);
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

		output = util.format(msg, name);
		return mod.result(passed, output, type);
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

	output = util.format(msg, name);
	return mod.result(passed, output, type);
}

mod.result = function(bool, message, type) {
	if(type === String || type === Array) {
		if(bool) {
			return '';
		} else {
			return message;
		}
	} else if(type === Boolean) {
		return bool;
	} else if(typeof type == 'function') {
		if(bool) {
			type(null, '');
		} else {
			type(null, message);
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


	output = util.format(msg, name);
	return mod.result(passed, output, type);
}

// Loop through validation functions
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
