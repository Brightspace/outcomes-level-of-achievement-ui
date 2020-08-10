/* global suite, test, fixture, expect, suiteSetup, suiteTeardown, sinon */

'use strict';
import { fixture, expect } from '@open-wc/testing';

describe('<d2l-outcomes-gradebook-eval>', function () {

	var element, sandbox;

	suiteSetup(function () {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
	});

	suiteTeardown(function () {
		sandbox.restore();
	});

	suite('smoke test', function () {

		test('can be instantiated', function () {
			expect(element.is).to.equal('d2l-outcomes-gradebook-eval');
		});

	});

	describe('Accessibility Tests', () => {

		it('should pass all axe tests', async () => {
			await expect(element).to.be.accessible();
		});

	});
});
