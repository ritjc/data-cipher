import cliHandle from '@/cli/index'
import logger from './libs/logger.js'
import encrypted from '@/utils/encrypted.js'
import decrypted from '@/utils/decrypted.js'
import { MODE_ENUM } from './config.js'
const { stringEncrypted, fileEncrypted } = encrypted
const { stringDecrypted, fileDecrypted } = decrypted

const transAdapter = {
	[MODE_ENUM.ENCRYPT]: {
		string: stringEncrypted,
		file: fileEncrypted,
	},
	[MODE_ENUM.DECRYPT]: {
		string: stringDecrypted,
		file: fileDecrypted,
	},
}

export { logger, cliHandle }

export { stringEncrypted, stringDecrypted, fileEncrypted, fileDecrypted }

export default async ({ input, output, type, mode, passphrase }) => {
	try {
		let transData = await transAdapter[mode][type](
			input,
			passphrase,
			output
		)
		transData && transData.length < 1000 && logger.info(transData)
	} catch (err) {
		logger.error(err)
	}
}
