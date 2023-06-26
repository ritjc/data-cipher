import colors from 'colors'
import { isPlainObject } from 'lodash'

colors.setTheme({
	info: 'green',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red',
})

const logger = {
	log: console.log,
	infos: (infos) => {
		return infos
			.reduce((infs, inf) => {
				infs.push(isPlainObject(inf) ? JSON.stringify(inf) : inf)
				return infs
			}, [])
			.join(',')
	},
	info: function (...infos) {
		this.log(colors.info(this.infos(infos)))
	},
	error: function (...infos) {
		this.log(colors.error(this.infos(infos)))
	},
	warn: function (...infos) {
		this.log(colors.warn(this.infos(infos)))
	},
	help: function (...infos) {
		this.log(colors.help(this.infos(infos)))
	},
}

export default logger
