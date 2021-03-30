import { Entity } from 'siren-sdk/src/es6/Entity';

export class AchievementLevelEntity extends Entity {
	static get class() { return 'level-of-achievement'; }

	getColor() {
		return this._entity && this._entity.properties && this._entity.properties.color;
	}

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	getSortOrder() {
		return this._entity && this._entity.properties && this._entity.properties.sortOrder;
	}
}
