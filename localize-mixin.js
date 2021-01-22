import { LocalizeMixin as CoreLocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';

export const LocalizeMixin = (superclass) => class extends CoreLocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		let translations;

		for await (const lang of langs) {
			switch (lang) {
				case 'ar':
					translations = await import('./build/lang/ar.js');
					break;
				case 'cy':
					translations = await import('./build/lang/cy.js');
					break;
				case 'da':
					translations = await import('./build/lang/da.js');
					break;
				case 'de':
					translations = await import('./build/lang/de.js');
					break;
				case 'en':
					translations = await import('./build/lang/en.js');
					break;
				case 'es-es':
					translations = await import('./build/lang/es-es.js');
					break;
				case 'es':
					translations = await import('./build/lang/es.js');
					break;
				case 'fr-fr':
					translations = await import('./build/lang/fr-fr.js');
					break;
				case 'fr':
					translations = await import('./build/lang/fr.js');
					break;
				case 'ja':
					translations = await import('./build/lang/ja.js');
					break;
				case 'ko':
					translations = await import('./build/lang/ko.js');
					break;
				case 'nl':
					translations = await import('./build/lang/nl.js');
					break;
				case 'pt':
					translations = await import('./build/lang/pt.js');
					break;
				case 'sv':
					translations = await import('./build/lang/sv.js');
					break;
				case 'tr':
					translations = await import('./build/lang/tr.js');
					break;
				case 'zh-tw':
					translations = await import('./build/lang/zh-tw.js');
					break;
				case 'zh':
					translations = await import('./build/lang/zh.js');
					break;
			}

			if (translations && translations.default) {
				return {
					language: lang,
					resources: translations.default
				};
			}
		}

		translations = await import('./build/lang/en.js');

		return {
			language: 'en',
			resources: translations.default
		};
	}

};
