import { FragmentComp, TRenderJSX, createElement, render } from 'matul'
import { filterFonts } from '../fun/filterFonts'
import { IFontInfo, loadFonts } from '../fun/loadFonts'
import { FontsComp } from './FontsComp'

export interface AppCompProps {}
export interface AppCompState {
	fonts: undefined | string | IFontInfo[]
	sampleText: string
	sampleSize: number
	query: string
	elem: HTMLDivElement | null
}

export const AppComp: TRenderJSX<AppCompProps, AppCompState> = (_, v) => {
	v.state.sampleText = v.state.sampleText ?? 'árvíztűrő tükörfúrógép'
	v.state.sampleSize = v.state.sampleSize ?? 48
	v.state.query = v.state.query ?? ''
	v.onadded = async () => {
		try {
			v.state.fonts = await loadFonts()
			render()
		} catch (e) {
			console.error(e)
			v.state.fonts = e + ''
		}
	}
	v.onupdated = () => {
		if (v.state.elem) {
			v.state.elem.style.setProperty(
				'--font-sample--font-size',
				v.state.sampleSize + 'px',
			)
		}
	}
	return (
		<div
			ref={(it: HTMLDivElement | null) => {
				v.state.elem = it
			}}
		>
			<div class='header'>
				<input
					class='sample-input'
					value={v.state.sampleText}
					oninput={(e: InputEvent) => {
						v.state.sampleText = (e.currentTarget as HTMLInputElement).value
						// render()
					}}
					onkeydown={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							render()
						}
					}}
					onblur={(e: FocusEvent) => {
						render()
					}}
				/>
				<input
					type='number'
					class='size-input'
					min={1}
					step={1}
					value={v.state.sampleSize + ''}
					oninput={(e: InputEvent) => {
						v.state.sampleSize = (
							e.currentTarget as HTMLInputElement
						).valueAsNumber
						// render()
					}}
					onkeydown={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							render()
						}
					}}
					onblur={(e: FocusEvent) => {
						render()
					}}
				/>
				<select
					onchange={(e: Event) => {
						const value = (e.currentTarget as HTMLSelectElement).value
						if (value) {
							v.state.sampleSize = parseInt(value, 10)
							render()
						}
					}}
				>
					<option value='' label='' />
					{[8, 10, 12, 14, 16, 18, 24, 36, 48, 60, 72, 96, 144].map((it) => (
						<option
							key={it}
							value={it}
							selected={v.state.sampleSize === it}
							label={it}
						/>
					))}
				</select>
				<input
					class='search-input'
					placeholder='Search'
					value={v.state.query}
					oninput={(e: InputEvent) => {
						v.state.query = (e.currentTarget as HTMLInputElement).value
						// render()
					}}
					onkeydown={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							render()
						}
					}}
					onblur={(e: FocusEvent) => {
						render()
					}}
				/>
			</div>
			{v.state.fonts == null && (
				<div>
					<em>Loading fonts...</em>
				</div>
			)}
			{typeof v.state.fonts === 'string' && <div>{v.state.fonts}</div>}
			{Array.isArray(v.state.fonts) && (
				<FontsComp
					_fonts={filterFonts(v.state.fonts, v.state.query)}
					_sampleText={v.state.sampleText}
				/>
			)}
		</div>
	)
}
