import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';

export class CalculationSettingEntity extends SelflessEntity {
	static get class() { return 'calculation-setting'; }

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	getContent() {
		return this._entity && this._entity.properties && this._entity.properties.content;
	}

}
