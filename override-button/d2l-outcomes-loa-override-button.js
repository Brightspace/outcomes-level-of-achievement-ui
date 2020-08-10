/**
`d2l-outcomes-loa-override-button`
Polymer Web-Component for a button that lets the user manually override
calculated values for a user's overall outcome achievement level

@demo demo/d2l-outcomes-loa-override-button.html
*/

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

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-loa-override-button">
<template strip-whitespace="">	
	<style>
	</style>
	<d2l-button-subtle text="[[buttonText]]" icon="[[buttonIcon]]" id="overrideButton" tabindex="-1" hidden="[[hidden]]">
	</d2l-button-subtle>
</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-outcomes-loa-override-button',

	properties: {

		buttonText: {
			type: String,
			value: 'Manually override'
		},

		buttonIcon: {
			type: String,
			value: 'tier1:edit'
		},

		hidden: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		overrideActive: {
			type: Boolean,
			value: false,
			reflectToAttribute: true,
			observer: '_onOverrideToggled'
		},

		index: {
			type: Number,
			reflectToAttribute: true
		},

		buttonData: {
			type: Object,
			value: function () { return {}; }
		},

		tooltipPosition: {
			type: String,
			value: 'bottom',
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

	//TODO: define event behavior and other methods
	ready: function () {
		afterNextRender(this, /* @this */ function () {
		});
	},

	_keyCodes: {
		ENTER: 13,
		SPACE: 32
	},

	_onOverrideToggled: function () {
		this.buttonIcon = this._getButtonIcon(this.overrideActive);
		this.buttonText = this._getButtonText(this.overrideActive);
	},

	_onKeyDown: function (event) {
		if (this.hidden) {
			return;
		}

		if (event.keyCode === this._keyCodes.ENTER || event.keyCode === this._keyCodes.SPACE) {
			this._toggleOverrideState();
			event.preventDefault();
		}
	},

	_handleTap: function (event) {
		if (this.hidden) {
			return;
		}

		this._toggleOverrideState();
		event.preventDefault();
	},

	_toggleOverrideState: function () {
		this.overrideActive = !this.overrideActive;
		this._dispatchItemToggledEvent(this.overrideActive);
	},

	_getHidden: function (hidden) {
		return hidden;
	},

	_getOverrideActive: function (overrideActive) {
		return overrideActive;
	},

	_getButtonText: function (overrideActive) {
		if (overrideActive) {
			return this.localize('clearManualOverride');
		}
		else {
			return this.localize('manuallyOverride');
		}
	},

	_getButtonIcon: function (overrideActive) {
		if (overrideActive) {
			return 'tier1:close-default';
		}
		else {
			return 'tier1:edit';
		}
	},

	_dispatchItemToggledEvent: function (newOverrideState) {
		var eventName = newOverrideState ? 'd2l-loa-manual-override-enabled' : 'd2l-loa-manual-override-disabled';
		//var eventName = 'd2l-manual-override-toggled';
		this.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			composed: true
			//newVal: newOverrideState
		}));
	}
});
