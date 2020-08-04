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
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-loa-calculation-help-button">
<template strip-whitespace="" id="button-template">	
	<style>
	</style>
	<d2l-button-icon id="help-button" text="[[buttonText]]" icon="[[buttonIcon]]" aria-hidden="true" tabindex="-1" hidden="[[hidden]]">
	</d2l-button-icon>

	<d2l-dialog id="help-dialog" title-text="Calculation Method Details">
		<div>Some dialog content</div>
		<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
	</d2l-dialog>
</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);


Polymer({
	is: 'd2l-outcomes-loa-calculation-help-button',

	properties: {

		buttonIcon: {
			type: String,
			value: 'tier1:help'
		},

		buttonText: {
			type: String,
			value: 'Calculation Method Details'
		},

		calculationMethod: {
			type: String,
			value: '',
			reflectToAttribute: true,
			observer: '_handleCalcMethodChanged'
		},

		dialogIsOpen: {
			type: Boolean,
			value: false
		},

		hidden: {
			type: Boolean,
			value: false,
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
			this.buttonText = this._getButtonText();
		});
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
		//this.dialogIsOpen = true;
		var elem = this.shadowRoot.getElementById('help-dialog');
		elem.opened = true;
		//TODO: handle dialog being closed
	},

	_onDialogClosed: function () {

		this.dialogIsOpen = false;
	},

	_handleCalcMethodChanged: function () {
		switch (this.calculationMethod) {
			case 'Decaying Average':
			case 'Most Common':
			case 'Highest':
				this.hidden = false;
				break;
			default:
				this.hidden = true;
				break;
		}
	},


	_getButtonText: function () {
		return this.localize('calculationMethodDetails');
	},

	_dispatchItemToggledEvent: function () {
		/*var eventName = newOverrideState ? 'd2l-loa-manual-override-enabled' : 'd2l-loa-manual-override-disabled';

		this.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true
		}));*/
	}
});
