import { FragmentComp, TRenderJSX, createElement } from 'matul'
import { IFontInfo } from '../fun/loadFonts'

export interface FontsCompProps {
	_fonts: IFontInfo[]
	_sampleText: string
}
export interface FontsCompState {}

export const FontsComp: TRenderJSX<FontsCompProps, FontsCompState> = (_, v) => {
	return (
		<div class='fonts'>
			{v.props._fonts.map((font, index) => (
				<div key={index} class='font'>
					<div class='font-label'>
						{font.name}
						{font.isBold && <b> Bold</b>}
						{font.isItalic && <i> Italic</i>}{' '}
						<span class='font-label-right'>
							<span class='font-type'>{font.type}</span>{' '}
							<span class='font-file'>{font.file}</span>
						</span>
					</div>
					<div
						class='font-sample'
						style={`font-family:'${
							font.name
						}', 'MY_FALLBACK_FONT'; font-weight: ${
							font.isBold ? 'bold' : 'normal'
						}; font-style: ${font.isItalic ? 'italic' : 'normal'}`}
					>
						{v.props._sampleText}
					</div>
				</div>
			))}
		</div>
	)
}
