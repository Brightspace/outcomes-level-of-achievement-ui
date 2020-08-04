/* global suite, test, fixture, expect, suiteSetup, suiteTeardown, sinon */

import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '../../override-button/d2l-outcomes-loa-override-button.js';

suite('<d2l-outcomes-loa-override-button>', function () {

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
			expect(element.is).to.equal('d2l-outcomes-loa-override-button');
		});

		test('correct inactive text and icon', function () {
			element.overrideActive = false;
			expect(element.buttonText).to.equal("Manually Override");
			expect(element.buttonIcon).to.equal("tier1:edit");
			expect(element.hidden).to.equal(false);
		});

		test('correct active text and icon', function () {
			element.overrideActive = true;
			expect(element.buttonText).to.equal("Clear Manual Override");
			expect(element.buttonIcon).to.equal("tier1:close-default");
			expect(element.hidden).to.equal(false);
		});
	});
});
