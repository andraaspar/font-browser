import { mount, render } from 'matul'
import { AppComp } from './comp/AppComp'
import './style.css'

main()

async function main() {
	const appElem = document.getElementById('app') as HTMLDivElement
	appElem.innerHTML = ''
	mount(appElem, AppComp)
	render()
}
