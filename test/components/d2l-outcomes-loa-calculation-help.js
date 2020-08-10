/* global suite, test, fixture, expect, suiteSetup, describe, done, afterEach, it, sinon */

import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '../../calculation/d2l-outcomes-loa-calculation-help.js';

describe('<d2l-outcomes-loa-calculation-help>', function() {

	var element, sandbox;

	suiteSetup(function() {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
		afterNextRender(element, function() {
			done();
		});
	});

	afterEach(function() {
		sandbox.restore();
	});

	suite('smoke test', function() {

		test('can be instantiated', function() {
			expect(element.is).to.equal('d2l-outcomes-loa-calculation-help');
		});

	});

	describe('Accessibility Tests', () => {

		it('should pass all axe tests', async() => {
			await expect(element).to.be.accessible();
		});

	});

});
