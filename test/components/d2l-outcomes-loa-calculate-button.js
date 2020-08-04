/* global suite, test, fixture, expect, suiteSetup, suiteTeardown, sinon */

import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '../../calculation/d2l-outcomes-loa-calculate-button.js';

suite('<d2l-outcomes-loa-calculate-button>', function () {

	var element, sandbox;

	suiteSetup(function () {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
		afterNextRender(element, function () {
			done();
		});
	});

	afterEach(function () {
		sandbox.restore();
	});

	suite('smoke test', function () {

		test('can be instantiated', function () {
			expect(element.is).to.equal('d2l-outcomes-loa-calculate-button');
		});

	});
});
