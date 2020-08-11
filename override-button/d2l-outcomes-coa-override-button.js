/**
`d2l-outcomes-coa-override-button`
Polymer Web-Component for a button that lets the user manually override
calculated values for a user's overall outcome achievement level

@demo demo/d2l-outcomes-coa-override-button.html
*/
const KEYCODE_ENTER = 13;
const KEYCODE_SPACE = 32;

import '@polymer/polymer/polymer-legacy.js';
import '../localize-behavior.js';
import 'd2l-polymer-behaviors/d2l-dom.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-colors/d2l-colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-coa-override-button">
<template strip-whitespace="">	
	<d2l-button-subtle text="[[_getButtonText(overrideActive)]]" icon="[[_getButtonIcon(overrideActive)]]" id="overrideButton" tabindex="-1">
	</d2l-button-subtle>
</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-outcomes-coa-override-button',

	properties: {

		overrideActive: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},
	},

	listeners: {
		'keydown': '_onKeyDown',
		'tap': '_handleTap'
	},

	behaviors: [
		D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	ready: function() {
		afterNextRender(this, /* @this */ function() {
		});
	},

	_onKeyDown: function(event) {
		if (this.hidden) {
			return;
		}

		if (event.keyCode === KEYCODE_ENTER || event.keyCode === KEYCODE_SPACE) {
			this._toggleOverrideState();
			event.preventDefault();
		}
	},

	_handleTap: function(event) {
		if (this.hidden) {
			return;
		}

		this._toggleOverrideState();
		event.preventDefault();
	},

	_toggleOverrideState: function() {
		this.overrideActive = !this.overrideActive;
		this._dispatchItemToggledEvent(this.overrideActive);
	},

	_getButtonText: function(overrideActive) {
		if (overrideActive) {
			return this.localize('clearManualOverride');
		}
		else {
			return this.localize('manuallyOverride');
		}
	},

	_getButtonIcon: function(overrideActive) {
		if (overrideActive) {
			return 'tier1:close-default';
		}
		else {
			return 'tier1:edit';
		}
	},

	_dispatchItemToggledEvent: function(newOverrideState) {
		var eventName = newOverrideState ? 'd2l-coa-manual-override-enabled' : 'd2l-coa-manual-override-disabled';
		this.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			composed: true
		}));
	}
});
