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
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-loa-calculation-help">
<template strip-whitespace="" id="button-template">	
	<d2l-button-icon id="help-button" text="[[_getHelpButtonText()]]" icon="[[buttonIcon]]" tabindex="-1">
	</d2l-button-icon>

	<d2l-dialog id="help-dialog" title-text="[[_getHelpMenuTitle()]]">
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
		
		<template id="help-content" is="dom-repeat" items="[[popupItems]]">
			<p><b>[[_getHelpItemLabelText(item)]]</b><br>[[_getHelpItemContentText(item)]]</p>
		</template>
		
		<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
	</d2l-dialog>
</template>
</dom-module> `;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-outcomes-loa-calculation-help',

	properties: {

		buttonIcon: {
			type: String,
			value: 'tier1:help'
		},

		popupItems: {
			type: Array,
			value: [],
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

	behaviors: [
		D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	//TODO: define event behavior and other methods
	ready: function() {
		afterNextRender(this, /* @this */ function() {
		});
	},

	_keyCodes: {
		ENTER: 13,
		SPACE: 32
	},

	_onKeyDown: function(event) {
		if (this.hidden) {
			return;
		}

		if (event.keyCode === this._keyCodes.ENTER || event.keyCode === this._keyCodes.SPACE) {
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

	//Text localization
	//Currently using placeholder arguments where applicable rather than properties or data
	_getHelpButtonText: function() {
		return this.localize('calculationMethodDetails');
	},

	_getHelpMenuTitle: function() {
		return this.localize('calculationMethodDetails');
	},

	_getHelpItemLabelText: function(item) {
		return this.localize('calcHelpItemLabel', 'label', item.label);
	},

	_getHelpItemContentText: function(item) {
		return this.localize('calcHelpItemContent', 'content', item.content);
	},

});
