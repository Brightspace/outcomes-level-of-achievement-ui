/**
`d2l-outcomes-coa-eval-override`
Polymer Web-Component to display controls for course overall achievements

@demo demo/d2l-outcomes-coa-eval-override.html
*/
import '@polymer/polymer/polymer-legacy.js';

import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/typography/typography.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';

import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';

import './d2l-outcomes-level-of-achievements.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

const KEYCODE_ENTER = 13;
const KEYCODE_SPACE = 32;

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

			#help-button {
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

			:host {
				display: block;
			}
		</style>
		<div class="flex-box">
			<h3 class="page-heading">Select Overall Achievement</h3>
			<template is="dom-if" if="[[_isCalculationUpdateNeeded(_calculationMethod, _newAssessmentsAdded, _isOverrideActive)]]">
				<span class="calculate-button-container">
					<d2l-button-icon id="calculate-button" onclick="[[_onCalcButtonClicked]]" text="[[localize('recalculateOverallAchievement')]]" icon="tier1:calculate"></d2l-button-icon>
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
					<d2l-button-icon id="help-button" onclick="[[_onHelpButtonClicked]]" text="[[localize('calculationMethodDetails')]]" icon="tier1:help"></d2l-button-icon>
				</template>
			</div>
		</template>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_isDecayingAverageVisible(_calculationMethod)]]">
			<div class="decaying-average-info">
				[[_getDecayingAverageText(_calculationMethod, _calculatedAchievementValue)]]
			</div>
		</template>

		<d2l-outcomes-level-of-achievements id="level-selector" tooltip-position="top" read-only="[[!_canEditLevel(_isOverrideActive, _calculationMethod)]]" has-calculation="[[_hasCalculation(_calculationMethod)]]" token="[[token]]" href="[[href]]"></d2l-outcomes-level-of-achievements>
	
		<template is="dom-if" if="[[_hasCalculation(_calculationMethod)]]">
			<d2l-button-subtle id="override-button" onclick="[[_onOverrideButtonClicked]]" text="[[_getOverrideButtonText(_isOverrideActive)]]" icon="[[_getOverrideButtonIcon(_isOverrideActive)]]"></d2l-button-subtle>
		</template>

		<d2l-dialog id="help-dialog" title-text="[[localize('calculationMethodDetails')]]">
			<style>
				p {
					@apply --d2l-body-text;
					display: block;
					content: "";
					margin-top: 30px;
				}

				br {
					display: block;
					content: "";
					margin-top: 18px;
				}
			</style>

			<div id="help-method">
				<p><b>[[localize('calcHelpMethodLabel')]]</b><br>[[localize('calcHelpMethodBody', 'calcMethod', _calculationMethod)]]</p>
			</div>
			<template is="dom-if" if="[[_shouldHelpShowDecayRate(_calculationMethod)]]" id="help-decaying-rate">
				<p><b>[[localize('calcHelpDecayRateLabel')]]</b><br>[[localize('calcHelpDecayRateBody', 'number', _decayingAverageRate)]]</p>
			</template>
			<div id="help-activities-used">
				<p><b>[[localize('calcHelpActivitiesLabel')]]</b><br>[[localize('calcHelpActivitiesBody', 'calcActivities', 'All activities')]]</p>
			</div>
			<template is="dom-if" if="[[_shouldHelpShowMultipleCommonLevelsPolicy(_calculationMethod)]]" id="help-multi-most-common-policy">
				<p><b>[[localize('calcHelpMultipleCommonLevelsLabel')]]</b><br>[[localize('calcHelpMultipleCommonLevelsBody', 'policy', 'Highest level')]]</p>
			</template>
			<template is="dom-if" if="[[_shouldHelpShowMultipleAttemptsPolicy(_calculationMethod)]]" id="help-multi-attempts-policy">
				<p><b>[[localize('calcHelpMultipleAttemptsLabel')]]</b><br>[[localize('calcHelpMultipleAttemptsBody', 'policy', 'Highest attempt')]]</p>
			</template>

			<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
		</d2l-dialog>
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

		_levelSelector: {
			type: Object,
			value: null
		},

	},

	listeners: {
		'keydown': '_onKeyDown',
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
		this._onCalcButtonClicked = this._onCalcButtonClicked.bind(this);
		this._onOverrideButtonClicked = this._onOverrideButtonClicked.bind(this);
		this._onHelpButtonClicked = this._onHelpButtonClicked.bind(this);
		this._levelSelector = this.$$('d2l-outcomes-level-of-achievements');
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

	_isDecayingAverageVisible: function(calculationMethod) {
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

	_shouldHelpShowDecayRate: function (calculationMethod) {
		return (calculationMethod === 'Decaying Average');
	},

	_shouldHelpShowMultipleCommonLevelsPolicy: function (calculationMethod) {
		return (calculationMethod === 'Most Common');
	},

	_shouldHelpShowMultipleAttemptsPolicy: function(calculationMethod) {
		switch (calculationMethod) {
			case 'Decaying Average':
			case 'Most Common':
				return true;
			default:
				return false;
		}
	},

	_canEditLevel: function(overrideActive, calculationMethod) {
		return overrideActive || !this._hasCalculation(calculationMethod);
	},

	_getDecayingAverageText: function(calculationMethod, calculatedValue) {
		return this.localize('calculatedValue', 'method', calculationMethod, 'value', calculatedValue.toString());
	},

	_getOverrideButtonText: function(overrideActive) {
		if (overrideActive) {
			return this.localize('clearManualOverride');
		}
		else {
			return this.localize('manuallyOverride');
		}
	},

	_getOverrideButtonIcon: function(overrideActive) {
		if (overrideActive) {
			return 'tier1:close-default';
		}
		else {
			return 'tier1:edit';
		}
	},

	//For keyboard accessibility
	_onKeyDown: function(event) {
		if (event.keyCode === KEYCODE_ENTER || event.keyCode === KEYCODE_SPACE) {
			console.log(this.shadowRoot.activeElement);
			this.shadowRoot.activeElement.click();
			event.preventDefault();
		}
	},

	_onOverrideButtonClicked: function() {
		console.log('override button clicked');
		console.log(this);
		if (!this._isOverrideActive) {
			this._isOverrideActive = true;
			this._levelSelector.setFocus();
		}
		else {
			if (this._isCalculationUpdateNeeded(this._calculationMethod, this._newAssessmentsAdded, true)) {
				this._updateLevelCalculation();
			}
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	},

	_onCalcButtonClicked: function() {
		console.log('calc button clicked');
		console.log(this);
		if (this._updateLevelCalculation()) {
			//Calculation successfully updated
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	},

	_onHelpButtonClicked: function() {
		var helpDialog = this.shadowRoot.getElementById('help-dialog');
		if (!helpDialog.opened) {
			helpDialog.opened = true;
		}
	},

	_updateLevelCalculation: function() {
		//Calculation request will be sent here. This will retrieve a calculated value and any corresponding data
		this._newAssessmentsAdded = false;
		return true;
	},
});
