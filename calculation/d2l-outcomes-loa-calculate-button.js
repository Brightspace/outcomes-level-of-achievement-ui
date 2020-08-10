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
import '@brightspace-ui/core/components/button/button-icon.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-loa-calculate-button">
<template strip-whitespace="">	
	<style>
	</style>
	<d2l-button-icon id="calculateButton" text="[[buttonText]]" icon="[[buttonIcon]]" tabindex="-1">
	</d2l-button-icon>
</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-outcomes-loa-calculate-button',

	properties: {

		buttonIcon: {
			type: String,
			value: 'tier1:calculate'
		},

		buttonText: {
			type: String,
			value: 'Recalculate Overall Achievement'
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
			this.buttonText = this._getButtonText();
		});
	},

	_getButtonText: function () {
		return this.localize('recalculateOverallAchievement');
	},

	_keyCodes: {
		ENTER: 13,
		SPACE: 32
	},

	_onKeyDown: function (event) {
		if (this.hidden) {
			return;
		}

		if (event.keyCode === this._keyCodes.ENTER || event.keyCode === this._keyCodes.SPACE) {
			this._handleSelected();
			event.preventDefault();
		}
	},

	_handleTap: function (event) {
		if (this.hidden) {
			return;
		}

		this._handleSelected();
		event.preventDefault();
	},

	//Invoked when the button is clicked, tapped, or keyboard-activated
	_handleSelected: function () {
		this._dispatchCalculationEvent();
	},

	_dispatchCalculationEvent: function () {
		var eventName = 'd2l-loa-calculation-clicked';
		this.dispatchEvent(new CustomEvent(eventName, {
			composed: true
		}));
	}
});
