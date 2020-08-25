/**
`d2l-outcomes-level-of-achievements`
LitElement component to display levels of achievements
@demo demo/d2l-outcomes-level-of-achievements.html
*/

import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';

import { Actions, Classes } from 'd2l-hypermedia-constants';
import './squishy-button-selector/d2l-squishy-button.js';
import './squishy-button-selector/d2l-squishy-button-selector.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from './localize-mixin.js';
export class d2lOutcomesLevelOfAchievements extends EntityMixinLit(LocalizeMixin(LitElement)) {

	static get properties() {
        return {
            readOnly: {
                type: Boolean,
                attribute: 'read-only',
                reflect: true
            },
            _hasAction: Boolean,
            _demonstrationLevels: Array,
            _suggestedLevel: Object,
            disableSuggestion: {
                type: Boolean,
                attribute: 'disable-suggestion',
                reflect: true
            }
        };
	}

	static get styles() {
		return css`
			d2l-squishy-button-selector {
				width: 100%;
			}
			d2l-squishy-button {
				max-width: 9rem;
			}
			.d2l-suggestion-text {
				@apply --d2l-body-small-text;
				margin: 0.3rem 0 0.3rem 0;
			}
			:host {
				display: block;
			}
		`;
	}

	render() {
        return html`
            <div id="suggestion-label">
    			${(!this.readOnly && this._hasAction && !this.disableSuggestion && !!this._suggestedLevel)
                ? html`
                    <p class="d2l-suggestion-text">${this.localize('suggestedLevel', 'level', this._suggestedLevel.text)}</p>`
                : html``}
			</div>
    		<d2l-squishy-button-selector tooltip-position="top" ?disabled=${this.readOnly || !this._hasAction}>
                ${this._demonstrationLevels.map((item, i) => {
                    const dataObj = { action: item.action };
                    return html` 
    				<d2l-squishy-button color="${item.color}" ?selected="${item.selected}" button-data="${dataObj}" index="${i}" id="item-${i}">
    					${item.text}
                    </d2l-squishy-button>`;
                })}
    		</d2l-squishy-button-selector>`;
	}

    constructor() {
        super();
        this.readOnly = false;
        this.disableSuggestion = false;
        this.hasAction = false;
        this._demonstrationLevels = [];
        this._demonstrationEntity = null;
        this._suggestedLevel = null;
	}

    firstUpdated() {
        this._onItemSelected = this._onItemSelected.bind(this);
        this.shadowRoot.querySelector('d2l-squishy-button-selector').addEventListener('d2l-squishy-button-selected', this._onItemSelected);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.addEventListener('refresh-outcome-demonstrations', this._handleRefresh);
        this._tryRetrieveDemonstrations();
    }

    _handleRefresh() {
        this._tryRetrieveDemonstrations();
    }

    _tryRetrieveDemonstrations() {
        if (this.token && this.href) {
            window.D2L.Siren.EntityStore.fetch(this.href, this.token, true).then(entity => {
                this._getDemonstrationLevels(entity.entity);
            });
        }
    }

	_getDemonstrationLevels(entity) {
		if (!entity) {
			return null;
		}
		let newSuggestedLevel;

		Promise.all(entity.getSubEntitiesByClass(Classes.outcomes.demonstratableLevel).map(function(e) {

			var selected = e.hasClass(Classes.outcomes.selected);
			var suggested = e.hasClass(Classes.outcomes.suggested);
			var action = e.getActionByName(Actions.outcomes.select) || e.getActionByName('deselect');
			var entityHref = e.getLinkByRel('https://achievements.api.brightspace.com/rels/level').href;

			return window.D2L.Siren.EntityStore.fetch(entityHref, this.token, true).then(function(levelRequest) {
				var levelEntity = levelRequest.entity;
				return {
					action: action,
					selected: selected,
					color: levelEntity && levelEntity.properties.color,
					text: levelEntity && levelEntity.properties.name,
					isSuggested: suggested
				};
			});
        }.bind(this))).then(function(demonstrationLevels) {
            this._demonstrationLevels = demonstrationLevels;

            var firstSuggested = undefined;
			var firstSuggestedIndex = null;
			for (var i = 0; i < demonstrationLevels.length; i++) {
				const level = demonstrationLevels[i];
				if (level.isSuggested) {
					firstSuggested = level;
					firstSuggestedIndex = i;
					break;
				}

			}
			if (typeof firstSuggested !== 'undefined') {
				newSuggestedLevel = {
					text: firstSuggested.text,
					index: firstSuggestedIndex
				};
			}

			this._hasAction = demonstrationLevels.some(function(level) { return !!level.action; });
		}.bind(this)).finally(function() {
			this._suggestedLevel = newSuggestedLevel;
		}.bind(this));

    }

	_onItemSelected(event) {
		var action = event.detail.data.action;
		if (!action) {
			return;
		}
		performSirenAction(action)
			.catch(function() { });
	}

	_getSuggestedLevelText(level) {
		return this.localize('suggestedLevel', 'level', level);
	}

    enableAndFocus() {
        this.readOnly = false;
        const selector = this.shadowRoot.querySelector('d2l-squishy-button-selector');
        selector.removeAttribute('disabled');
        selector.focus();
	}

	resetToSuggested() {
		var suggestedLevelElement = this.shadowRoot.getElementById('item-' + this._suggestedLevel.index.toString());
		suggestedLevelElement.click();
	}
}

customElements.define('d2l-outcomes-level-of-achievements', d2lOutcomesLevelOfAchievements);
