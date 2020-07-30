import '@polymer/polymer/polymer-legacy.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-polymer-behaviors/d2l-dom.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-loa-override-button">
<template strip-whitespace="">	
	<style>
	</style>

	<d2l-tooltip id="tooltip[[index]]" hidden$="[[!_textOverflowing]]" position$="[[tooltipPosition]]" boundary="{&quot;left&quot;: 0, &quot;right&quot;:0}" aria-hidden="">[[text]]</d2l-tooltip>

	<div class="d2l-outcomes-loa-override-button-container">
		<d2l-button-subtle aria-hidden="true" on-focusin="_handleVisibleFeedbackFocusin" on-focusout="_handleVisibleFeedbackFocusout" id="addFeedback[[_getRowIndex(criterionNum)]]" tabindex="-1" hidden="[[!_showAddFeedback(criterion, criterionResultMap, criterionNum, _addingFeedback, _savingFeedback.*, _feedbackInvalid.*)]]" text="[[localize('addFeedback')]]" on-click=""></d2l-button-subtle>
	</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-outcomes-loa-override-button',

	properties: {
		selected: {
			type: Boolean,
			reflectToAttribute: true,
			observer: '_handleSelected'
		},

		hidden: Boolean,
		overrideActive: Boolean,

		index: {
			type: Number,
			reflectToAttribute: true
		},

		buttonData: {
			type: Object,
			value: function () { return {}; }
		},

		textLangterm: {
			type: String,
			reflectToAttribute: true,
		},

		shortText: {
			type: String,
			reflectToAttribute: true
		},

		tooltipPosition: {
			type: String,
			value: 'bottom',
			reflectToAttribute: true
		},
	},

	//TODO: define event behavior and other methods

	_getHidden: function (hidden) {
		return hidden;
	},

	_getOverrideActive: function (overrideActive) {
		return overrideActive;
	},

	_getText: function (overrideActive) {

	}

});
