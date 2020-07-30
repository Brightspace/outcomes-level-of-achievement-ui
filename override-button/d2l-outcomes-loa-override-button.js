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
		<d2l-button-subtle text="[[_getButtonText()]]" icon="[[_getButtonIcon()]]" aria-hidden="true" id="overrideButton" tabindex="-1" hidden="[[hidden]]" on-click="_handleSelected"></d2l-button-subtle>
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

	//TODO: define event behavior and other methods
	ready: function () {
		afterNextRender(this, /* @this */ function () {
			this._measureSize = this._measureSize.bind(this);
			this._handleDomChanges = this._handleDomChanges.bind(this);

			window.addEventListener('resize', this._measureSize);
			this._slotObserver = dom(this).observeNodes(this._handleDomChanges);

			this._measureSize();
			this._updateColor(this.color);
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
			//TODO: handle button toggle similar to handling clicks

		}
	},

	_handleTap: function (event) {
		if (this.disabled) {
			return;
		}

		this._dispatchItemSelectedEvent(true, true);
		this.selected = true;
		event.preventDefault();
	},

	_handleSelected: function (newVal, oldVal) {
		if (newVal === false && newVal === oldVal) {
			return;
		}

		this._dispatchItemSelectedEvent(false, newVal);
	},

	_getHidden: function (hidden) {
		return hidden;
	},

	_getOverrideActive: function (overrideActive) {
		return overrideActive;
	},

	_getButtonText: function () {
		if (this.overrideActive) {
			return this.localize('clearManualOverride')
		}
		else {
			return this.localize('manuallyOverride')
		}
	}

	_getButtonIcon: function () {
		if (this.overrideActive) {
			return "tier1:cancel";
		}
		else {
			return "tier1:edit";
		}
	}

});
