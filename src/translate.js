import { request } from "undici"

export const supportedLangs = ["af", "sq", "am", "ar", "hy", "az", "eu", "bn", "bs", "bg", "ca", "ceb", "zh-CN", "zh-TW", "co", "hr", "cs", "da", "nl",
	"en", "eo", "et", "fi", "fr", "fy", "gl", "ka", "de", "el", "gu", "ht", "ha", "haw", "iw", "hi", "hmn", "hu", "is", "id", "ga",
	"ja", "jw", "kn", "kk", "km", "ko", "ku", "lo", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "ne", "no", "ny",
	"ps", "fa", "pl", "pt", "pa", "ro", "ru", "sm", "gd", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "sw", "sv",
	"tl", "tg", "ta", "te", "th", "tr", "uk", "ur", "uz", "vi", "cy", "xh", "yi", "yo", "zu"]

/**
 * @typedef Lang
 * @type {typeof supportedLangs[keyof typeof supportedLangs]}
 */

/**
 * @param {String} text
 * @param {Lang} sourceLang
 * @param {Lang} targetLang
 * @return {Promise<[String, Lang]>}
 */
export default async function translate(text, sourceLang, targetLang) {
	checkLang(sourceLang)
	checkLang(targetLang)

	let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(text)}`

	const [result, lang] = await request(url)
		.then(({ body }) => body.json())
		.then(response => {
			const data = response[0]
			let result = ''

			for (let line = 0; line < data.length; line++) {
				result += data[line][0]
			}

			return [result, response[2]]
		})

	return [result, lang]
}

/** @param {Lang} lang */
function checkLang(lang) {
	if (!supportedLangs.includes(lang) && lang != "auto")
		throw new Error("Invalid lang used: "+lang)
}
