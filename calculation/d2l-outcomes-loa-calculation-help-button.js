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
	<d2l-button-icon id="help-button" text="[[_getHelpButtonText()]]" icon="[[buttonIcon]]" aria-hidden="true" tabindex="-1" hidden="[[hidden]]">
	</d2l-button-icon>

	<d2l-dialog id="help-dialog" title-text="[[_getHelpMenuTitle()]]">
		<style>
			p {
			    display: block;
			    content: "";
				font-size = 12px;
				line-height: 30px;
			}
		</style>

		<div id="help-method">
			<p><b>[[_getHelpMethodLabel()]]</b><br>[[_getHelpMethodBody()]]</p>
		</div>
		<div id="help-decaying-rate">
			<p><b>[[_getHelpDecayRateLabel()]]</b><br>[[_getHelpDecayRateBody()]]</p>
		</div>
		<div id="help-activities-used">
			<p><b>[[_getHelpActivitiesLabel()]]</b><br>[[_getHelpActivitiesBody()]]</p>
		</div>
		<div id="help-multi-most-common-policy">
			<p><b>[[_getHelpMultipleCommonLevelsLabel()]]</b><br>[[_getHelpMultipleCommonLevelsBody()]]</p>
		</div>
		<div id="help-multi-attempts-policy">
			<p><b>[[_getHelpMultipleAttemptsLabel()]]</b><br>[[_getHelpMultipleAttemptsBody()]]</p>
		</div>
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

		calculationMethod: {
			type: String,
			value: '',
			reflectToAttribute: true,
			observer: '_handleCalcMethodChanged'
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
		var elem = this.shadowRoot.getElementById('help-dialog');
		elem.opened = true;
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

	//Text localization
	//Currently using placeholder arguments where applicable rather than properties or data
	_getHelpButtonText: function () {
		return this.localize('calculationMethodDetails');
	},

	_getHelpMenuTitle: function () {
		return this.localize('calculationMethodDetails');
	},

	_getHelpMethodLabel: function () {
		return this.localize('calcHelpMethodLabel');
	},

	_getHelpMethodBody: function () {
		return this.localize('calcHelpMethodBody', 'calcMethod', this.calculationMethod);
	},

	_getHelpDecayRateLabel: function () {
		return this.localize('calcHelpDecayRateLabel');
	},

	_getHelpDecayRateBody: function () {
		return this.localize('calcHelpDecayRateBody', 'number', '75');
	},

	_getHelpActivitiesLabel: function () {
		return this.localize('calcHelpActivitiesLabel');
	},

	_getHelpActivitiesBody: function () {
		return this.localize('calcHelpActivitiesBody', 'calcActivities', 'All activities');
	},

	_getHelpMultipleCommonLevelsLabel: function () {
		return this.localize('calcHelpMultipleCommonLevelsLabel');
	},

	_getHelpMultipleCommonLevelsBody: function () {
		return this.localize('calcHelpMultipleCommonLevelsBody', 'policy', 'Highest level');
	},

	_getHelpMultipleAttemptsLabel: function () {
		return this.localize('calcHelpMultipleAttemptsLabel');
	},

	_getHelpMultipleAttemptsBody: function () {
		return this.localize('calcHelpMultipleAttemptsBody', 'policy', 'Highest attempt');
	},


	_dispatchItemToggledEvent: function () {
		/*var eventName = newOverrideState ? 'd2l-loa-manual-override-enabled' : 'd2l-loa-manual-override-disabled';

		this.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true
		}));*/
	}
});
