import { escapeRegExp } from 'lodash'
import { IFontInfo } from './loadFonts'

export function filterFonts(fonts: IFontInfo[], query: string): IFontInfo[] {
	const queryTrimmed = query.trim()
	if (!queryTrimmed) return fonts
	const words = queryTrimmed
		.split(/\s+/)
		.map((it) => escapeRegExp(it))
		.map((it) => new RegExp(it, 'isu'))
	return fonts.filter((font) => {
		const str = [font.name, font.isBold && 'Bold', font.isItalic && 'Italic']
			.filter(Boolean)
			.join(' ')
		for (const word of words) {
			if (!word.test(str)) {
				return false
			}
		}
		return true
	})
}
