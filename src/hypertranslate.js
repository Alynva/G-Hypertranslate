import translate, { supportedLangs } from './translate.js'

/**
 * @param {String} text
 * @param {import('./translate.js').Lang} begin_lang
 * @param {import('./translate.js').Lang} end_lang
 * @param {Number} count
 */
export default async function hypertranslate(text, begin_lang, end_lang, count) {
	if (isNaN(count) || count < 1)
		throw new Error("Invalid count: " + count)
	
	const [realText, lang] = await translate(text, begin_lang, end_lang)

	if (lang) {
		if (begin_lang === 'auto') begin_lang = lang
		if (end_lang === 'auto') end_lang = lang
	}
	
	let currentText = realText,
		currentSource = begin_lang
	for (let progress = 0; progress < count; progress++) {
		const langNumber = Math.floor(Math.random() * (supportedLangs.length + 1))
		const nextTarget = progress < count - 1 ? supportedLangs[langNumber] : end_lang

		const newTranslation = await translate(currentText, currentSource, nextTarget)
		currentText = newTranslation[0]
		currentSource = nextTarget
	}

	return currentText
}
