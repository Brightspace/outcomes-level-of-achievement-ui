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
			<template is="dom-if" if="[[_isCalculationUpdateNeeded(calculationMethod, newAssessmentsAdded, isOverrideEnabled)]]">
				<span class="calculate-button-container">
					<d2l-outcomes-coa-calculate-button align="right" update-needed="[[!_calcUpdateNeeded]]" tabindex="0"></d2l-outcomes-coa-calculate-button>
				</span>
			</template>
		</div>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_hasCalculation(calculationMethod)]]">
			<div class="calculation-info">
				<span class="calculation-label">
					Calculation method: [[calculationMethod]]
				</span>
				<d2l-outcomes-coa-calculation-help id="calculation-help" popup-items="[[_helpMenuItems]]" hidden="[[!_hasHelpMenu]]" tabindex="0"></d2l-outcomes-coa-calculation-help>
			</div>
		</template>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_isDecayingAverageVisible(calculationMethod)]]">
			<div class="decaying-average-info">
				[[_getDecayingAverageText(calculationMethod, calculatedAchievementValue)]]
			</div>
		</template>

		<d2l-outcomes-level-of-achievements id="level-selector" tooltip-position="top" read-only="[[!_canEditLevel(isOverrideEnabled, calculationMethod)]]" has-calculation="[[_hasCalculation(calculationMethod)]]" token="[[_getToken()]]" href="[[href]]";>
		</d2l-outcomes-level-of-achievements>
	
		<template is="dom-if" if="[[_hasCalculation(calculationMethod)]]">
			<d2l-outcomes-coa-override-button id="override-button" tooltip-position="top" override-active="[[isOverrideEnabled]]" tabindex="0"></d2l-outcomes-coa-override-button>
		</template>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-outcomes-coa-eval-override',

	properties: {

		isOverrideEnabled: {
			type: Boolean,
			value: false
		},

		newAssessmentsAdded: {
			type: Boolean,
			value: false
		},

		calculatedLevel: {
			type: String,
			value: null
		},

		calculationMethod: {
			type: String,
			value: null
		},

		calculatedAchievementValue: {
			type: Number,
			value: 0.0
		},

		decayingAverageRate: {
			type: Number,
			value: 75
		},

		token: {
			type: String,
			value: 'abc123'
		},

		_calcUpdateNeeded: {
			type: Boolean,
			value: false
		},

		_hasHelpMenu: {
			type: Boolean,
			value: false
		},
		_helpMenuItems: {
			type: Array,
			value: []
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
			this.calculatedAchievementValue = demonstrationCalculatedValue;
		}
		var overrideActive = entity.properties.overrideActive;
		if (overrideActive) {
			this.isOverrideEnabled = overrideActive;
		}
		var newAssessments = entity.properties.newAssessments;
		if (newAssessments) {
			this.newAssessmentsAdded = newAssessments;
		}

		var calcMethodHref = entity.getLinkByRel('calculation-method').href;
		window.D2L.Siren.EntityStore.fetch(calcMethodHref, this.token, true).then(calcMethodRequest => {
			var calcMethod = calcMethodRequest.entity;
			this.calculationMethod = calcMethod.properties.name;
			//TODO: help menu content population
			this._hasHelpMenu = calcMethod.properties.hasHelpPopup;
			this._helpMenuItems = [];
			var newHelpMenuItems = calcMethod.getSubEntitiesByClass('help-popup-item');
			newHelpMenuItems.forEach((item) => {
				var itemObj = {
					label: item.properties.label,
					content: item.properties.content
				};
				this._helpMenuItems.push(itemObj);
			});
		});

	},

	_isDecayingAverageVisible: function(calculationMethod) {
		if (calculationMethod === 'Decaying Average') {
			return true;
		}
		else {
			return false;
		}
	},

	_isCalculationUpdateNeeded: function(calculationMethod, newAssessments, overrideActive) {
		return this._hasCalculation(calculationMethod) && overrideActive && newAssessments;
	},

	_hasCalculation: function(calculationMethod) {
		return !!calculationMethod && calculationMethod !== 'None';
	},

	_canEditLevel: function(overrideActive, calculationMethod) {
		return overrideActive || !this._hasCalculation(calculationMethod);
	},

	_getDecayingAverageText: function(calculationMethod, calculatedValue) {
		return this.localize('calculatedValue', 'method', calculationMethod, 'value', calculatedValue.toString());
	},

	_getToken: function() {
		return this.token;
	},

	_onOverrideEnabled: function() {
		this.isOverrideEnabled = true;
		this._levelSelector.setFocus();
	},

	_onOverrideDisabled: function() {
		//Update the level calculation if necessary
		if (this._isCalculationUpdateNeeded(this.calculationMethod, this.newAssessmentsAdded, true)) {
			this._updateLevelCalculation();
		}

		this._levelSelector.resetToSuggested();
		this.isOverrideEnabled = false;
	},

	_onCalcButtonClicked: function() {
		if (this._updateLevelCalculation()) {
			//Calculation successfully updated
			this._levelSelector.resetToSuggested();
			this.isOverrideEnabled = false;
		}
	},

	_updateLevelCalculation: function() {
		//TODO: send calculation request here. This will retrieve a calculated value and any corresponding data
		this.newAssessmentsAdded = false;
		return true;
	}

});
