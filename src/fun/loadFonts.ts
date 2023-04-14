import { exec } from 'child_process'

export interface IFontInfo {
	originalName: string
	name: string
	type: string
	file: string
	isBold: boolean
	isItalic: boolean
}

const rowRe = /^\s*(.*?)\s+(\(.*?\)|)\s+REG_SZ\s+(.*)$/
const boldRe = /[- ]*Bold(?:[- ]*(?:Italic|Oblique))?\s*$/
const italicRe = /[- ]*(?:Italic|Oblique)\s*$/
const truncateNameRe =
	/(?:[- ]*Regular)?(?:[- ]*Bold)?(?:[- ]*(?:Italic|Oblique))?\s*$/

export function loadFonts() {
	return new Promise<string>((resolve, reject) => {
		const cmd = `chcp 65001|powershell -command "chcp 65001|Out-Null;reg query 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts' /s`

		exec(
			cmd,
			{ maxBuffer: 1024 * 1024 * 10 },
			(err: unknown, stdout: string) => {
				if (err) {
					reject(err)
					return
				}

				resolve(stdout)
			},
		)
	}).then((s): IFontInfo[] => {
		const rows = s
			.split('\r\n')
			.filter((row) => !row.startsWith('HKEY_') && !!row.trim())
		const result = rows.flatMap((row): IFontInfo | IFontInfo[] => {
			console.log(`[rt07ss] row:`, row)
			// rowRe.lastIndex = 0
			const rowResult = rowRe.exec(row)
			if (rowResult == null || rowResult.length < 4)
				throw new Error(`[rt07g4] Invalid font info: ${JSON.stringify(row)}`)
			const file = rowResult[3]
			if (file.endsWith('.ttc')) {
				return rowResult[1]
					.split(/\s+&\s+/)
					.map(
						(name): IFontInfo =>
							regexResultToFontInfo(['', name, rowResult[2], rowResult[3]]),
					)
			} else {
				return regexResultToFontInfo(rowResult)
			}
		})
		result.sort((a, b) => a.name.localeCompare(b.name))
		return result
	})
}

function regexResultToFontInfo(r: string[]): IFontInfo {
	const name = r[1]
	const isBold = boldRe.test(name)
	const isItalic = italicRe.test(name)
	return {
		originalName: name,
		name: name.replace(truncateNameRe, ''),
		type: r[2],
		file: r[3],
		isBold: isBold,
		isItalic: isItalic,
	}
}
