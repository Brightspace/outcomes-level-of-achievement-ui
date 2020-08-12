/**
`d2l-outcomes-coa-eval-override`
Polymer Web-Component to display controls for course overall achievements

@demo demo/d2l-outcomes-coa-eval-override.html
*/
import '@polymer/polymer/polymer-legacy.js';

import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/typography/typography.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';

import './d2l-outcomes-level-of-achievements.js';
import './override-button/d2l-outcomes-coa-override-button.js';
import './calculation/d2l-outcomes-coa-calculate-button.js';
import './calculation/d2l-outcomes-coa-calculation-help.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-coa-eval-override">
	<template strip-whitespace="">
		<style include="d2l-typography">

			.d2l-suggestion-text {
				@apply --d2l-body-small-text;
				margin: 0.3rem 0 0.3rem 0;
			}

			.page-heading {
				@apply --d2l-heading-3;
				margin: 0;
				padding-top: 36px;
				padding-bottom: 10px;
				float: left;
			}

			:dir(rtl) .page-heading {
				@apply --d2l-heading-3;
				margin: 0;
				padding-top: 36px;
				padding-bottom: 10px;
				float: right;
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

			.calculate-button-container {
				float: right;
				width: 44px;
				height: 44px;
				margin: 0px;
				padding-top: 24px;
			}
			:dir(rtl) .calculate-button-container {
				float: left;
				width: 44px;
				height: 44px;
				margin: 0px;
				padding-top: 24px;
			}

			.calculation-label {
				@apply --d2l-body-small-text;
				float: left;
				margin-top: 20px;
				margin-bottom: 12px;
			}
			:dir(rtl) .calculation-label {
				@apply --d2l-body-small-text;
				float: right;
				margin-top: 30px;
				margin-bottom: 12px;
			}

			d2l-outcomes-coa-calculation-help {
				float: left;
				margin-bottom: 12px;
				margin-top: 6px;
				margin-left: 6px;
			}
			:dir(rtl) d2l-outcomes-coa-calculation-help {
				float: right;
				margin-bottom: 12px;
				margin-top: 16px;
				margin-right: 6px;
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

			d2l-outcomes-coa-override-button {
				
			}

			:host {
				display: block;
			}
		</style>
		<div class="flex-box">
			<h3 class="page-heading">Select Overall Achievement</h3>
			<template is="dom-if" if="[[_isCalculationUpdateNeeded(_calculationMethod, _newAssessmentsAdded, _isOverrideActive)]]">
				<span class="calculate-button-container">
					<d2l-outcomes-coa-calculate-button align="right" tabindex="0"></d2l-outcomes-coa-calculate-button>
				</span>
			</template>
		</div>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_hasCalculation(_calculationMethod)]]">
			<div class="calculation-info">
				<span class="calculation-label">
					Calculation method: [[_calculationMethod]]
				</span>
				<template is="dom-if" if="[[_hasHelpMenu(_calculationMethod)]]">
					<d2l-outcomes-coa-calculation-help id="calculation-help" calculation-method="[[_calculationMethod]]" decaying-average-rate="[[_decayingAverageRate]]" tabindex="0"></d2l-outcomes-coa-calculation-help>
				</template>
			</div>
		</template>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_isDecayingAverageVisible(_calculationMethod)]]">
			<div class="decaying-average-info">
				[[_getDecayingAverageText(_calculationMethod, _calculatedAchievementValue)]]
			</div>
		</template>

		<d2l-outcomes-level-of-achievements id="level-selector" tooltip-position="top" read-only="[[!_canEditLevel(_isOverrideActive, _calculationMethod)]]" has-calculation="[[_hasCalculation(_calculationMethod)]]" token="[[token]]" href="[[href]]";>
		</d2l-outcomes-level-of-achievements>
	
		<template is="dom-if" if="[[_hasCalculation(_calculationMethod)]]">
			<d2l-outcomes-coa-override-button id="override-button" tooltip-position="top" override-active="[[_isOverrideActive]]" tabindex="0"></d2l-outcomes-coa-override-button>
		</template>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-outcomes-coa-eval-override',

	properties: {

		_isOverrideActive: {
			type: Boolean,
			value: false
		},

		_newAssessmentsAdded: {
			type: Boolean,
			value: false
		},

		calculatedLevel: {
			type: String,
			value: null
		},

		_calculationMethod: {
			type: String,
			value: null
		},

		_calculatedAchievementValue: {
			type: Number,
			value: 0.0
		},

		_decayingAverageRate: {
			type: Number,
			value: 75
		},

		_calcUpdateNeeded: {
			type: Boolean,
			value: false
		},

		_loaSelector: {
			type: Object,
			value: null
		},

	},

	observers: [
		'_getCalculationDetails(entity)'
	],

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	ready: function() {
		this._levelSelector = this.$$('d2l-outcomes-level-of-achievements');
		this.addEventListener('d2l-coa-manual-override-enabled', this._onOverrideEnabled);
		this.addEventListener('d2l-coa-manual-override-disabled', this._onOverrideDisabled);
		this.addEventListener('d2l-coa-calculation-clicked', this._onCalcButtonClicked);
	},

	_getCalculationDetails: function(entity) {
		if (!entity) {
			return null;
		}

		var demonstrationCalculatedValue = entity.properties.calculatedValue;
		if (demonstrationCalculatedValue) {
			this._calculatedAchievementValue = demonstrationCalculatedValue;
		}
		var overrideActive = entity.properties.overrideActive;
		if (overrideActive) {
			this._isOverrideActive = overrideActive;
		}
		var newAssessments = entity.properties.newAssessments;
		if (newAssessments) {
			this._newAssessmentsAdded = newAssessments;
		}

		var calcMethodHref = entity.getLinkByRel('calculation-method').href;
		window.D2L.Siren.EntityStore.fetch(calcMethodHref, this.token, true).then(calcMethodRequest => {
			var calcMethod = calcMethodRequest.entity;
			this._calculationMethod = calcMethod.properties.name;
		});

	},

	_isDecayingAverageVisible: function (calculationMethod) {
		return (calculationMethod === 'Decaying Average');
	},

	_isCalculationUpdateNeeded: function(calculationMethod, newAssessments, overrideActive) {
		return this._hasCalculation(calculationMethod) && overrideActive && newAssessments;
	},

	_hasCalculation: function(calculationMethod) {
		return !!calculationMethod && calculationMethod !== 'None';
	},

	_hasHelpMenu: function(calculationMethod) {
		return (calculationMethod === 'Decaying Average'
			|| calculationMethod === 'Most Common'
			|| calculationMethod === 'Highest');
	},
	_canEditLevel: function(overrideActive, calculationMethod) {
		return overrideActive || !this._hasCalculation(calculationMethod);
	},

	_getDecayingAverageText: function(calculationMethod, calculatedValue) {
		return this.localize('calculatedValue', 'method', calculationMethod, 'value', calculatedValue.toString());
	},

	_onOverrideEnabled: function() {
		this._isOverrideActive = true;
		this._levelSelector.setFocus();
	},

	_onOverrideDisabled: function() {
		//Update the level calculation if necessary
		if (this._isCalculationUpdateNeeded(this._calculationMethod, this._newAssessmentsAdded, true)) {
			this._updateLevelCalculation();
		}

		this._levelSelector.resetToSuggested();
		this._isOverrideActive = false;
	},

	_onCalcButtonClicked: function() {
		if (this._updateLevelCalculation()) {
			//Calculation successfully updated
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	},

	_updateLevelCalculation: function() {
		//Calculation request will be sent here. This will retrieve a calculated value and any corresponding data
		this._newAssessmentsAdded = false;
		return true;
	}

});
