'use strict';

const {has, set} = require('lodash');

const insertMethods = ['insert'];
const updateMethods = ['update', 'findOneAndUpdate'];
const isInsertMethod = method => insertMethods.indexOf(method) !== -1;
const isAnUpdateMethod = method => updateMethods.indexOf(method) !== -1;

const getTypeOf = object => {
	if (Array.isArray(object)) {
		return 'array';
	}
	return typeof object;
};

const updateTimestamp = propertyPath => data => {
	// Only add/update the createdAt timestamp if it does not exist
	if (propertyPath.includes('createdAt') && has(data, propertyPath)) {
		return;
	}
	return set(data, propertyPath, new Date());
};

const checkAndAddCurrentDate = (data, property) => {
	const updateTimestampWithProperty = updateTimestamp(property);
	const addTimestampBasedOnType = {
		array: () => data.forEach(updateTimestampWithProperty),
		object: () => updateTimestampWithProperty(data)
	};
	addTimestampBasedOnType[getTypeOf(data)]();
};

const addTimestamps = () => next => (args, method) => {
	if (isInsertMethod(method)) {
		checkAndAddCurrentDate(args.data, 'createdAt');
	}
	if (isAnUpdateMethod(method)) {
		checkAndAddCurrentDate(args.update, 'updatedAt');
	}
	return next(args, method).then(res => {
		return res;
	});
};

module.exports = addTimestamps;
