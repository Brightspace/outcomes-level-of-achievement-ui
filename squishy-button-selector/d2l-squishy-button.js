import '@polymer/polymer/polymer-legacy.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-polymer-behaviors/d2l-dom.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-squishy-button">
<template strip-whitespace="">
		<style>
			:host {
				height: 100%;
				flex: 1;
				display: block;

				cursor: pointer;
				outline: none;

				background-color: white;

				--d2l-squishy-button-border-width: 1px;
			}

			:host {
				box-sizing: border-box;
				border: var(--d2l-squishy-button-border-width) solid var(--d2l-color-tungsten);
				margin-left: calc(-1 * var(--d2l-squishy-button-border-width));
			}
			:host(:dir(rtl)),
			:host-context([dir="rtl"]) {
				margin-left: 0;
				margin-right: calc(-1 * var(--d2l-squishy-button-border-width));
			}
			:host(:first-of-type) {
				margin: 0;
			}

			:host([disabled]) {
				border: 0px;
				z-index: 0;
			}

			:host([selected]) {
				border: var(--d2l-squishy-button-border-width) solid var(--d2l-squishy-button-selected-color, var(--d2l-color-galena));
				z-index: 1;
			}

			[hidden] {
				display: none !important;
			}

			.d2l-squishy-button-container {
				@apply --d2l-body-small-text;

				display: flex;
				justify-content: center;
				align-items: center;

				margin: 0;
				color: var(--d2l-color-tungsten);
			}
			:host([selected]) .d2l-squishy-button-container {
				color: var(--d2l-color-ferrite);
				font-weight: 700;
			}

			.d2l-squishy-button-inner {
				max-height: 100%;
				border: 5px solid transparent; /* padding, but outside the content box */
				box-sizing: border-box;

				overflow: hidden;
				word-break: break-all;
				text-align: center;
			}

			.d2l-squishy-button-container {
				position: relative;
				width: 100%;
				height: 100%;
				z-index: 1;
			}
			.d2l-squishy-button-container::before {
				content: "";
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;

				opacity: 0.1;
				z-index: -1;
			}
			:host([selected]) .d2l-squishy-button-container::before,
			:host(:focus) .d2l-squishy-button-container::before,
			:host(:hover) .d2l-squishy-button-container::before {
				background-color: var(--d2l-squishy-button-selected-color, var(--d2l-color-galena));
			}

			::slotted(*) {
				pointer-events: none;
			}
		</style>

		<d2l-tooltip id="tooltip[[index]]" hidden$="[[!_textOverflowing]]" position$="[[tooltipPosition]]" boundary="{&quot;left&quot;: 0, &quot;right&quot;:0}" aria-hidden="">[[text]]</d2l-tooltip>

		<div class="d2l-squishy-button-container">
			<div id="textwrapper" class="d2l-squishy-button-inner">
				<div aria-hidden="" hidden$="[[!_showShortText(shortText, _textOverflowing)]]">[[shortText]]</div>
				<div id="textarea"><slot></slot></div>
			</div>
		</div>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-squishy-button',

	hostAttributes: {
		tabindex: '-1',
		role: 'radio'
	},

	properties: {
		selected: {
			type: Boolean,
			reflectToAttribute: true,
			observer: '_handleSelected'
		},

		disabled: Boolean,

		ariaDisabled: {
			type: Boolean,
			reflectToAttribute: true,
			readOnly: true,
			computed: '_getDisabled(disabled)'
		},

		index: {
			type: Number,
			reflectToAttribute: true
		},

		buttonData: {
			type: Object,
			value: function() { return {}; }
		},

		color: {
			type: String,
			observer: '_updateColor'
		},

		text: {
			type: String,
			reflectToAttribute: true,
			observer: '_measureSize'
		},

		shortText: {
			type: String,
			reflectToAttribute: true
		},

		_textOverflowing: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
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

	ready: function() {
		afterNextRender(this, /* @this */ function() {
			this._measureSize = this._measureSize.bind(this);
			this._handleDomChanges = this._handleDomChanges.bind(this);

			window.addEventListener('resize', this._measureSize);
			this._slotObserver = dom(this).observeNodes(this._handleDomChanges);

			this._measureSize();
			this._updateColor(this.color);
		});
	},

	_getDisabled: function(disabled) {
		return disabled;
	},

	detached: function() {
		window.removeEventListener('resize', this._measureSize);
		if (this._slotObserver) {
			dom(this).unobserveNodes(this._slotObserver);
		}
	},

	_handleDomChanges: function() {
		this.text = this.textContent;
		this.dispatchEvent(new CustomEvent('squishy-button-text-changed', { bubbles: true }));
	},

	_keyCodes: {
		ENTER: 13,
		SPACE: 32
	},

	_showShortText: function(shortText, textOverflowing) {
		return shortText && textOverflowing;
	},

	_measureSize: function() {
		fastdom.measure(function() {
			var innerHeight = this.$.textarea.offsetHeight;
			var outerHeight = this.$.textwrapper.offsetHeight;
			this._textOverflowing = innerHeight > outerHeight;
		}.bind(this));
	},

	_getTextClass: function(shortText, textOverflowing) {
		return this._showShortText(shortText, textOverflowing) ? 'squishy-button-hide' : '';
	},

	_updateColor: function(color) {
		if (color) {
			this.updateStyles({'--d2l-squishy-button-selected-color': color });
		}
	},

	_onKeyDown: function(event) {
		if (this.disabled) {
			return;
		}

		if (event.keyCode === this._keyCodes.ENTER || event.keyCode === this._keyCodes.SPACE) {
			this.selected = true;
			event.preventDefault();
			this._dispatchItemSelectedEvent(true, true);
		}
	},

	_handleTap: function(event) {
		if (this.disabled) {
			return;
		}

		this._dispatchItemSelectedEvent(true, true);
		this.selected = true;
		event.preventDefault();
	},

	_handleSelected: function(newVal, oldVal) {
		if (newVal === false && newVal === oldVal) {
			return;
		}

		this._dispatchItemSelectedEvent(false, newVal);
	},

	_dispatchItemSelectedEvent: function(triggeredByUserAction, selected) {
		var eventName = triggeredByUserAction ? 'd2l-squishy-button-selected' : 'd2l-squishy-button-selection-changed';
		this.dispatchEvent(new CustomEvent(eventName, {
			detail: {
				index: this.index,
				data: this.buttonData,
				selected: selected
			},
			bubbles: true
		}));
	}
});
