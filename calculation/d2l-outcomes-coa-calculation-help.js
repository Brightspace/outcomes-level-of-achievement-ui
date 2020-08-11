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
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-coa-calculation-help">
<template strip-whitespace="" id="button-template">	
	<d2l-button-icon id="help-button" text="[[localize('calculationMethodDetails')]]" icon="tier1:help" tabindex="-1">
	</d2l-button-icon>

	<d2l-dialog id="help-dialog" title-text="[[localize('calculationMethodDetails')]]">
		<style>
			p {
				@apply --d2l-body-text;
				display: block;
				content: "";
				margin-top: 30px;
			}

			br {
				display: block; /* makes it have a width */
				content: ""; /* clears default height */
				margin-top: 18px; /* change this to whatever height you want it */
			}
		</style>

		<div id="help-method">
			<p>
				<b>[[localize('calcHelpMethodLabel')]]</b><br>
				[[localize('calcHelpMethodBody', 'calcMethod', calculationMethod)]]
			</p>
		</div>
		<template is="dom-if" if="[[_shouldShowDecayRate(calculationMethod)]]" id="help-decaying-rate">
			<p>
				<b>[[localize('calcHelpDecayRateLabel')]]</b><br>
				[[localize('calcHelpDecayRateBody', 'number', decayingAverageRate)]]
			</p>
		</template>
		<div id="help-activities-used">
			<p>
				<b>[[localize('calcHelpActivitiesLabel')]]</b><br>
				[[localize('calcHelpActivitiesBody', 'calcActivities', 'All activities')]]
			</p>
		</div>
		<template is="dom-if" if="[[_shouldShowMultipleCommonLevelsPolicy(calculationMethod)]]" id="help-multi-most-common-policy">
			<p>
				<b>[[localize('calcHelpMultipleCommonLevelsLabel')]]</b><br>
				[[localize('calcHelpMultipleCommonLevelsBody', 'policy', 'Highest level')]]
			</p>
		</template>
		<template is="dom-if" if="[[_shouldShowMultipleAttemptsPolicy(calculationMethod)]]" id="help-multi-attempts-policy">
			<p>
				<b>[[localize('calcHelpMultipleAttemptsLabel')]]</b><br>
				[[localize('calcHelpMultipleAttemptsBody', 'policy', 'Highest attempt')]]
			</p>
		</template>

		<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
	</d2l-dialog>
</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-outcomes-coa-calculation-help',

	properties: {

		calculationMethod: {
			type: String,
			value: "None",
			reflectToAttribute: true
		},

		decayingAverageRate: {
			type: Number,
			value: 0,
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

	_onKeyDown: function(event) {
		if (this.hidden) {
			return;
		}

		if (event.keyCode === KEYCODE_ENTER || event.keyCode === KEYCODE_SPACE) {
			this._handleSelected();
		}
	},

	_handleTap: function(event) {
		if (this.hidden) {
			return;
		}

		this._handleSelected();
		event.preventDefault();
	},

	//Invoked when the button is clicked, tapped, or keyboard-activated
	_handleSelected: function() {
		var helpDialog = this.shadowRoot.getElementById('help-dialog');
		if (!helpDialog.opened) {
			helpDialog.opened = true;
		}
	},

	_shouldShowDecayRate: function(calculationMethod) {
		return (calculationMethod === 'Decaying Average');
	},

	_shouldShowMultipleCommonLevelsPolicy: function(calculationMethod) {
		return (calculationMethod === 'Most Common');
	},

	_shouldShowMultipleAttemptsPolicy: function(calculationMethod) {
		switch (calculationMethod) {
			case 'Decaying Average':
			case 'Most Common':
				return true;
			default:
				return false;
		}
	},
});
