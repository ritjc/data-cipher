import path from 'path'
import inquirer from 'inquirer'
import logger from '@/libs/logger'
import main from '@/main.js'

import { MODE_ENUM } from '../config'

const promptHandle = async (prompt) => {
	let answer = await inquirer.prompt([prompt])
	if (!answer[prompt.name]) return promptHandle(prompt)
	return answer
}

export default async (cmdName, params, options) => {
	/* logger.info(
		`cmdName: ${cmdName}\ninput: ${input}\noutput: ${output}\ntype: ${type}\nmode: ${mode}\npassphrase: ${passphrase}`
	) */
	if ([MODE_ENUM.ENCRYPT, MODE_ENUM.DECRYPT].includes(cmdName))
		params.mode = cmdName
	if (
		!params.mode ||
		![MODE_ENUM.ENCRYPT, MODE_ENUM.DECRYPT].includes(params.mode)
	) {
		Object.assign(
			params,
			await promptHandle({
				type: 'list',
				message: 'Enter ' + options['mode'][1],
				name: 'mode',
				choices: [MODE_ENUM.ENCRYPT, MODE_ENUM.DECRYPT],
			})
		)
	}
	if (!params.input) {
		Object.assign(
			params,
			await promptHandle({
				type: 'input',
				message: 'Enter ' + options['input'][1],
				name: 'input',
			})
		)
	}
	if (!params.type || !['string', 'file'].includes(params.type)) {
		Object.assign(
			params,
			await promptHandle({
				type: 'list',
				message: 'Enter ' + options['type'][1],
				name: 'type',
				choices: ['string', 'file'],
			})
		)
	}
	if (!params.passphrase) {
		Object.assign(
			params,
			await promptHandle({
				type: 'password',
				message: 'Enter ' + options['passphrase'][1],
				name: 'passphrase',
			})
		)
	}
	if (!params.output && params.type === 'file') {
		Object.assign(
			params,
			await promptHandle({
				type: 'input',
				message: 'Enter ' + options['output'][1],
				name: 'output',
			})
		)
	}
	params.output &&
		(params.output = path.resolve(process.cwd(), params.output))
	logger.info(params)

	await main(params)
}
