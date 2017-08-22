'use strict';

const monk = require('monk');
const chai = require('chai');

const expect = chai.expect;
const db = monk('127.0.0.1/timestamps');
const addTimestamps = require('../src');

db.addMiddleware(addTimestamps);
describe('Middleware timestamps', () => {
	let dummyCollection;
	before(() => {
		db.create('dummy');
		dummyCollection = db.get('dummy');
	});
	after(() => {
		dummyCollection.drop();
	});
	it('insert method adds `createdAt` property if not exists', () => {
		// Test an object
		dummyCollection.insert({some: 'object'})
			.then(doc => {
				expect(doc).to.have.property('createdAt');
				expect(doc.createdAt).to.be.a('Date');
				expect(doc).to.have.property('some');
				expect(doc.some).to.equal('object');
			})
			.catch(console.error);
		// Test an array of objects
		dummyCollection.insert([{another: 'object'}, {yet: 'another'}])
			.then(docs => {
				docs.forEach(doc => {
					expect(doc).to.have.property('createdAt');
					expect(doc.createdAt).to.be.a('Date');
				});
			})
			.catch(console.error);
	});
	it('update method updates/adds `updatedAt`', () => {
		dummyCollection.update({some: 'object'}, {some: 'changedObject'})
			.then(() => {
				dummyCollection.findOne({some: 'changedObject'})
					.then(doc => {
						expect(doc).to.be.an('object');
						expect(doc).to.have.property('updatedAt');
						expect(doc.updatedAt).to.be.a('Date');
					})
					.catch(console.error);
			})
			.catch(console.error);
	});
	it('findOneAndUpdate method updates/adds `updatedAt`', () => {
		dummyCollection.findOneAndUpdate({another: 'object'}, {another: 'changedHere'})
			.then(doc => {
				expect(doc).to.be.an('object');
				expect(doc).to.have.property('updatedAt');
				expect(doc.updatedAt).to.be.a('Date');
			})
			.catch(console.error);
	});
});
