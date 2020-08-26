import { Entity } from 'siren-sdk/src/es6/Entity';
import { CalculationSettingEntity } from './CalculationSettingEntity';

export class CalculationMethodEntity extends Entity {
	static get class() { return 'calculation-method'; }

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	getSettings() {
		if (!this._entity) {
			return;
		}
		const settingEntities = [];
		const settings = this._entity.getSubEntitiesByClass(CalculationSettingEntity.class);
		for (var i = 0; i < settings.length; i++) {
			const setting = settings[i];
			settingEntities.push(new CalculationSettingEntity(this, setting));
		}
		return settingEntities;
	}
}
