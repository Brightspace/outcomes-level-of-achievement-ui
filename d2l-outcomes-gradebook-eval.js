/**
`d2l-outcomes-gradebook-eval`
Polymer Web-Component to display levels of achievements

@demo demo/d2l-outcomes-gradebook-eval.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@brightspace-ui/core/components/colors/colors.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
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

			.d2l-typography {
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

			.title-container {
				float: left;
				margin-top: 0;
			}

			.calc-button-container {
				float: right;
				width: 44px;
				height: 44px;
				margin: 0;
				padding-top: 24px;
			}

			d2l-outcomes-loa-calculate-button {
			}

			.calculation-info {
				@apply --d2l-body-small-text;
				padding-bottom: 12px;
			}

			.decaying-average-info {
				@apply --d2l-body-small-text;
				padding-bottom: 12px;
			}

			d2l-outcomes-level-of-achievements {
				width: 100%;
				padding-bottom: 12px;
			}

			d2l-outcomes-loa-override-button {
				
			}

			:host {
				display: block;
			}
		</style>
		
		<div class="flex-box">
			<span class="title-container">
				<h3 class="page-heading">Select Overall Achievement</h3>
			</span>
			<span class="calc-button-container">
				<d2l-outcomes-loa-calculate-button align="right" update-needed tabindex="0"></d2l-outcomes-loa-calculate-button>
			</span>
		</div>

		<div style="clear: both;"></div>

		<span class="calculation-info">
			Calculation method: Decaying Average
			<d2l-outcomes-loa-calculation-help calculation-method="Highest" tabindex="0"></d2l-outcomes-loa-calculation-help>
		</span>
		<div class="decaying-average-info" display="">
			Decaying Average: 3.24
		</div>

		<d2l-outcomes-level-of-achievements tooltip-position="top" readonly="[[!overrideEnabled]]" token="[[_getToken()]]" href="[[levelsOfAchievementData]]">
		</d2l-outcomes-level-of-achievements>
	
		<d2l-outcomes-loa-override-button tooltip-position="top" tabindex="0">
		</d2l-outcomes-loa-override-button>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-outcomes-gradebook-eval',

	properties: {
		overrideEnabled: {
			type: Boolean,
			value: false
		},

		//Should link to the siren data for the achievement selector component
		levelsOfAchievementData: {
			type: String,
			value: null,
			reflectToAttribute: true
		},

		token: {
			type: String,
			value: "abc123",
			reflectToAttribute: true
		},

	},

	observers: [
		//'_getDemonstrationLevels(entity)'
	],

	behaviors: [
		//D2L.PolymerBehaviors.Siren.EntityBehavior,
		//D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		//D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	ready: function () {
	},

	_getToken: function () {
		return this.token;
	}

});
