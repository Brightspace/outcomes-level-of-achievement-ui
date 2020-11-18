import { Entity } from 'siren-sdk/src/es6/Entity';
import { DemonstratableLevelEntity } from './DemonstratableLevelEntity';
import { CalculationMethodEntity } from './CalculationMethodEntity';

export class DemonstrationEntity extends Entity {
	static get class() { return 'demonstration'; }

	static get classes() {
		return {
			masteryOverride: 'mastery-override',
			masterySnapshot: 'mastery-snapshot'
		}
	}

	static get actions() {
		return {
			publish: 'publish'
		}
	}

	getCalculatedValue() {
		return this._entity && this._entity.properties && this._entity.properties.calculatedValue;
	}
	//This might be changed later to compare assessment date with the most recent assessment (waiting on backend work)
	hasNewAssessments() {
		return this._entity && this._entity.properties && this._entity.properties.newAssessments;
	}

	getDemonstratedLevel() {
		if (!this._entity) {
			return;
		}

		const levelEntity = this._entity.getSubEntityByClasses([DemonstratableLevelEntity.class, DemonstratableLevelEntity.classes.selected]);
		return new DemonstratableLevelEntity(this, levelEntity);
	}

	getAllDemonstratableLevels() {
		if (!this._entity) {
			return;
		}
		const levels = this._entity.getSubEntitiesByClass(DemonstratableLevelEntity.class);
		return levels.map(level => new DemonstratableLevelEntity(this, level));
	}

	getPublishAction() {
		return this._entity.getActionByName(DemonstrationEntity.actions.publish);
	}

	isManualOverride() {
		return this._entity.hasClass(DemonstrationEntity.classes.masteryOverride);
	}

	onCalcMethodChanged(onChange) {
		const href = this._calcMethodHref();
		href && this._subEntity(CalculationMethodEntity, href, onChange);
	}

	_calcMethodHref() {
		if (!this._entity || !this._entity.hasLinkByRel('calculation-method')) {
			return;
		}

		return this._entity.getLinkByRel('calculation-method').href;
	}
}
