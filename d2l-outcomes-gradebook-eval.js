/**
`d2l-outcomes-gradebook-eval`
Polymer Web-Component to display controls for course overall achievements

@demo demo/d2l-outcomes-gradebook-eval.html
*/
import '@polymer/polymer/polymer-legacy.js';

import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/typography/typography.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import { Actions, Classes } from 'd2l-hypermedia-constants';

import './d2l-outcomes-level-of-achievements.js';
import './override-button/d2l-outcomes-loa-override-button.js';
import './calculation/d2l-outcomes-loa-calculate-button.js';
import './calculation/d2l-outcomes-loa-calculation-help.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-gradebook-eval">
	<template strip-whitespace="">
		<style include="d2l-typography">

			:host {
				background-color: --d2l-color-regolith;
			}

			.left-border {
				border-left-width: 6px;
				border-left-style: solid;
				border-left-color: --d2l-color-gypsum;
			}

			.d2l-suggestion-text {
				@apply --d2l-body-small-text;
				margin: 0.3rem 0 0.3rem 0;
			}

			.page-heading {
				@apply --d2l-heading-3;
				margin: 0;
				padding-top: 36px;
			}

			.flex-box {
				width: 100%;
			}

			.title-container {
				float: left;
				margin-top: 0;
				margin-bottom: 0;
			}
			:dir(rtl) .title-container {
				float: right;
				margin-top: 0;
				margin-bottom: 0;
			}

			d2l-outcomes-calculate-button {
				float: right;
				width: 44px;
				height: 44px;
				margin: 0px;
				padding-top: 36px;
			}
			:dir(rtl) d2l-outcomes-calculate-button {
				float: left;
				width: 44px;
				height: 44px;
				margin: 0px;
				padding-top: 24px;
			}

			.calculation-label {
				@apply --d2l-body-small-text;
				float: left;
				margin-top: 30px;
				margin-bottom: 12px;
			}
			:dir(rtl) .calculation-label {
				@apply --d2l-body-small-text;
				float: right;
				margin-top: 30px;
				margin-bottom: 12px;
			}

			d2l-outcomes-loa-calculation-help {
				float: left;
				margin-bottom: 0;
				margin-top: 16px;
				margin-left: 2px;
			}
			:dir(rtl) d2l-outcomes-loa-calculation-help {
				float: right;
				margin-bottom: 0;
				margin-top: 16px;
				margin-right: 2px;
			}

			.decaying-average-info {
				@apply --d2l-body-small-text;
				padding-bottom: 12px;
				padding-top: 0px;
			}

			d2l-outcomes-level-of-achievements {
				width: 100%;
				padding-bottom: 12px;
				padding-top: 0px;
			}

			d2l-outcomes-loa-override-button {
				
			}

			:host {
				display: block;
			}
		</style>
		<div class="flex-box">
			<span class="title-container">
				<h3 class="page-heading">Select Overall Achievement
					<d2l-outcomes-loa-calculate-button align="right" update-needed="[[!_calcUpdateNeeded]]" tabindex="0"></d2l-outcomes-loa-calculate-button>
				</h3>
			</span>
		</div>

		<div style="clear: both;"></div>

		<div class="calculation-info">
			<span class="calculation-label">
				Calculation method: [[calculationMethod]]
			</span>
			<d2l-outcomes-loa-calculation-help calculation-method="[[calculationMethod]]" decaying-average-rate="[[decayingAverageRate]]" tabindex="0"></d2l-outcomes-loa-calculation-help>
		</div>

		<div style="clear: both;"></div>

		<div class="decaying-average-info" hidden="[[!_isDecayingAverageVisible()]]">
			[[_getDecayingAverageText()]]
		</div>

		<d2l-outcomes-level-of-achievements id="level-selector" tooltip-position="top" read-only="[[!isOverrideEnabled]]" has-calculation="[[_hasCalculation()]]" token="[[_getToken()]]" href="[[levelsOfAchievementData]]">
		</d2l-outcomes-level-of-achievements>
	
		<d2l-outcomes-loa-override-button id="override-button" tooltip-position="top" override-active="[[isOverrideEnabled]]" tabindex="0">
		</d2l-outcomes-loa-override-button>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-outcomes-gradebook-eval',

	properties: {


		isOverrideEnabled: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		newAssessmentsAdded: {
			type: Boolean,
			value: true,
			reflectToAttribute: true
		},

		//Should link to the siren data for the achievement selector component
		levelsOfAchievementData: {
			type: String,
			value: null,
			reflectToAttribute: true
		},

		calculatedLevel: {
			type: String,
			value: null
		},

		calculationMethod: {
			type: String,
			value: null,
			reflectToAttribute: true
		},

		decayingAverageValue: {
			type: Float32Array,
			value: 0.0
		},

		decayingAverageRate: {
			type: Float32Array,
			value: 75
		},

		token: {
			type: String,
			value: "abc123",
			reflectToAttribute: true
		},

		_calcUpdateNeeded: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		_calcButton: {
			type: Object,
			value: null
		},

		_loaSelector: {
			type: Object,
			value: null
		},

		_overrideButton: {
			type: Object,
			value: null
		},

	},

	observers: [
		//'_getDemonstrationLevels(entity)'
	],

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	ready: function () {
		this._calcButton = this.$$('d2l-outcomes-loa-calculate-button');
		this._levelSelector = this.$$('d2l-outcomes-level-of-achievements');
		this._overrideButton = this.$$('d2l-outcomes-loa-override-button');
		this.addEventListener('d2l-loa-manual-override-enabled', this._onOverrideEnabled);
		this.addEventListener('d2l-loa-manual-override-disabled', this._onOverrideDisabled);
		this.addEventListener('d2l-loa-calculation-clicked', this._onCalcButtonClicked);
		this._updateCalculationButtonVisibility();
	},

	_updateCalculationButtonVisibility: function () {
		console.log("checking calculation status");
		this._calcUpdateNeeded = (this.isOverrideEnabled && this.newAssessmentsAdded && this._hasCalculation());
		console.log(this._calcUpdateNeeded);
		this._calcButton.setUpdateNeeded(this._calcUpdateNeeded);
	},

	_isDecayingAverageVisible: function () {
		if (this.calculationMethod === 'Decaying Average') {
			return true;
		}
		else {
			return false;
		}
	},

	_hasCalculation: function () {
		return !!this.calculationMethod && this.calculationMethod != 'None';
	},

	_getDecayingAverageText: function () {
		return this.localize('decayingAverageValue', 'value', this.decayingAverageValue.toString());
	},

	_getToken: function () {
		return this.token;
	},

	_onOverrideEnabled: function (event) {
		this.isOverrideEnabled = true;
		this._levelSelector.setFocus();
		this._updateCalculationButtonVisibility();
	},

	_onOverrideDisabled: function (event) {
		this._levelSelector.resetToSuggested();
		this.isOverrideEnabled = false;
		this._updateCalculationButtonVisibility();
	},

	_onCalcButtonClicked: function (event) {
		//TODO: send calculation request here. This will return a suggested level.
		//Change selection to this new suggested level, then hide the calculation button
		this._levelSelector.resetToSuggested();
		this.newAssessmentsAdded = false;
		this._updateCalculationButtonVisibility();
	}
});
