/**
`d2l-outcomes-coa-eval-override`
LitElement component to display controls for course overall achievements

@demo demo/d2l-outcomes-coa-eval-override.html
*/

import '@brightspace-ui/core/components/typography/typography.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';

import './d2l-outcomes-level-of-achievements.js';

import { Actions, Classes } from 'd2l-hypermedia-constants';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from './localize-mixin.js';
import { KEYCODES } from './keycodes.js';

export class d2lOutcomesCOAEvalOverride extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			_isOverrideActive: Boolean,

			_isOverrideAllowed: Boolean,

			_newAssessmentsAdded: Boolean,

			_calculationMethod: String,

			_calculatedAchievementValue: Number,

			_levelSelector: Object,

			_helpPopupItems: {
				type: Array,
				value: []
			},

			token: {
				type: String,
				attribute: 'token',
				reflect: true
			},

			href: {
				type: String,
				attribute: 'href',
				reflect: true
			}
		};
	}

	static get styles() {
		return css`
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

			:host([dir="rtl"]) .page-heading {
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
			:host([dir="rtl"]) .title-container {
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
			:host([dir="rtl"]) .calculate-button-container {
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
			:host([dir="rtl"]) .calculation-label {
				@apply --d2l-body-small-text;
				float: right;
				margin-top: 20px;
				margin-bottom: 12px;
			}

			.decaying-average-info {
				@apply --d2l-body-small-text;
				margin-top: 0px;
				margin-bottom: 12px;				
			}

			:host([dir="rtl"]) .decaying-average-info {
				@apply --d2l-body-small-text;
				margin-top: 0px;
				margin-bottom: 12px;				
			}

			#help-button {
				float: left;
				margin-bottom: 0px;
				margin-top: 6px;
				margin-left: 6px;
			}

			:host([dir="rtl"]) #help-button {
				float: right;
				margin-bottom: 0px;
				margin-top: 6px;
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
		`;
	}

	render() {
		return html`
		<div class="flex-box">
			<h3 class="page-heading">Select Overall Achievement</h3>
			${(!!this._calculationMethod && this._newAssessmentsAdded && this._isOverrideActive)
			? html`
				<span class="calculate-button-container">
					<d2l-button-icon id="calculate-button"
						@click=${this._onCalcButtonClicked}
						text="${this.localize('recalculateOverallAchievement')}"
						icon="tier1:calculate">
					</d2l-button-icon>
				</span>`
			: html``
			}
		</div>

		<div style="clear: both;"></div>

		${this._calculationMethod
		? html`
			<div class="calculation-info">
				<span class="calculation-label">
					Calculation method: ${this._calculationMethod}
				</span>
				${this._helpPopupItems.length > 0
				? html`
					<d2l-button-icon id="help-button"
						@click=${this._onHelpButtonClicked}
						text="${this.localize('calculationMethodDetails')}"
						icon="tier1:help">
					</d2l-button-icon>
					<d2l-dialog id="help-dialog" title-text="${this.localize('calculationMethodDetails')}">
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

						${this._helpPopupItems.map((item) => html`
							<p><b>${item.label}:</b><br>${item.content}</p>
						`)}

						<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
					</d2l-dialog>`
					: html``
				}
			</div>`
		: html``
		}

		<div style="clear: both;"></div>

		${(this._calculationMethod === 'Decaying Average')
		? html`
			<div class="decaying-average-info">
				${this._calculationMethod}: ${this._calculatedAchievementValue}
			</div>`
		: html``}

		<d2l-outcomes-level-of-achievements
				id="level-selector"
				tooltip-position="top"
				?read-only="${!this._isOverrideActive && !!this._calculationMethod}"
				disable-suggestion=""
				token="${this._token}"
				href="${this.href}">
		</d2l-outcomes-level-of-achievements>
	
		${(this._isOverrideAllowed && !!this._calculationMethod)
		? html`
	        <d2l-button-subtle id="override-button"
			    @click=${this._onOverrideButtonClicked}
					text="${this.localize(this._isOverrideActive ? 'clearManualOverride' : 'manuallyOverride')}"
                    icon="${this._isOverrideActive ? 'tier1:close-default' : 'tier1:edit'}"
			/>`
		: html ``
		}
		`;
	}
	constructor() {
		super();

		this._isOverrideActive = false;
		this._isOverrideAllowed = false;
		this._newAssessmentsAdded = false;
		this._calculationMethod = null;
		this._entity = null;
		this._token = null;

		this._onCalcButtonClicked = this._onCalcButtonClicked.bind(this);
		this._onOverrideButtonClicked = this._onOverrideButtonClicked.bind(this);
		this._onHelpButtonClicked = this._onHelpButtonClicked.bind(this);

		this.addEventListener('d2l-squishy-button-selected', this._onItemSelected);
		this.addEventListener('d2l-coa-manual-override-enabled', this._onOverrideEnabled);
		this.addEventListener('keydown', this._onKeyDown);
	}

	firstUpdated() {
		this._levelSelector = this.shadowRoot.getElementById('level-selector');
		if (this.token && this.href) {
			window.D2L.Siren.EntityStore.fetch(this.href, this.token, true).then(entity => {
				this._getCalculationDetails(entity.entity);
			});
		}
	}

	set token(val) {
		this._token = val;
		if (this._token && this.href) {
			this._initializeDemonstrationEntity(this.href, val);
		}
	}

	async _initializeDemonstrationEntity(href, token) {
		if (href && token) {
			this._entity = await window.D2L.Siren.EntityStore.fetch(href, token, true);
		}
	}

	set _entity(entity) {
		this._getCalculationDetails(entity);
	}

	_getCalculationDetails(entity) {
		if (!entity) {
			return null;
		}
		var demonstration = entity.entity;
		if (demonstration.hasProperty('calculatedValue')) {
			this._calculatedAchievementValue = demonstration.properties.calculatedValue;
		}
		if (demonstration.hasProperty('newAssessments')) {
			this._newAssessmentsAdded = demonstration.properties.newAssessments;
        }

		var calcMethodRel = demonstration.getLinkByRel('calculation-method');
		if (calcMethodRel) {
			window.D2L.Siren.EntityStore.fetch(calcMethodRel.href, this.token, true).then(calcMethodRequest => {
				var calcMethod = calcMethodRequest.entity;
				this._calculationMethod = calcMethod.properties.name;

				//Help menu population
				this._helpPopupItems = [];
				var helpMenuEntities = calcMethod.getSubEntitiesByClass('calculation-setting');
				helpMenuEntities.forEach((item) => {
					var helpItemObj = {
						label: item.properties.name,
						content: item.properties.content
					};
					this._helpPopupItems.push(helpItemObj);
				});
			});
		}
		//determine if override is allowed and/or enabled
		var levels = demonstration.getSubEntitiesByClass(Classes.outcomes.demonstratableLevel);
		this._isOverrideAllowed = false;
		this._isOverrideActive = false;
		levels.forEach((level) => {
			var suggested = level.hasClass(Classes.outcomes.suggested);
			var hasSelectAction = !!(level.getActionByName(Actions.outcomes.select));

			if (hasSelectAction) {
				this._isOverrideAllowed = true;
			}
			if (suggested && hasSelectAction) {
				this._isOverrideActive = true;
			}
		});

	}

	_isCalculationUpdateNeeded(calculationMethod, newAssessments, overrideActive) {
		return !!calculationMethod && overrideActive && newAssessments;
	}

	//For keyboard accessibility
	_onKeyDown(event) {
		if (event.keyCode === KEYCODES.ENTER || event.keyCode === KEYCODES.SPACE) {
			this.shadowRoot.activeElement.click();
			event.preventDefault();
		}
	}

	_onOverrideButtonClicked() {
		if (!this._isOverrideActive) {
			this._isOverrideActive = true;
			this._levelSelector.enableAndFocus();
		}
		else {
			if (this._isCalculationUpdateNeeded(this._calculationMethod, this._newAssessmentsAdded, true)) {
				this._updateLevelCalculation();
			}
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	}

	_onCalcButtonClicked() {
		if (this._updateLevelCalculation()) {
			//Calculation successfully updated
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	}

	_onHelpButtonClicked() {
		var helpDialog = this.shadowRoot.getElementById('help-dialog');
		if (!helpDialog) {
			return;
		}
		if (!helpDialog.opened) {
			helpDialog.opened = true;
		}
	}

	_updateLevelCalculation() {
		//Calculation request will be sent here. This will retrieve a calculated value and any corresponding data
		this._newAssessmentsAdded = false;
		return true;
	}
}

customElements.define('d2l-outcomes-coa-eval-override', d2lOutcomesCOAEvalOverride);
