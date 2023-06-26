import {
	createReadStream,
	createWriteStream,
	ensureFileSync,
	removeSync,
	readFileSync,
} from 'fs-extra'
import logger from '@/libs/logger'
import { writeFileContent } from './fileIo'

const { scryptSync, createDecipheriv } = require('crypto')

const getIv = (ivHex) => {
	return new Uint8Array(
		ivHex instanceof Buffer ? ivHex : Buffer.from(ivHex, 'hex')
	)
}

const decipheriv = (pwd, iv) => {
	const algorithm = 'aes-192-cbc'
	const key = scryptSync(pwd, 'salt', 24)
	return createDecipheriv(algorithm, key, iv)
}

const strDecrypted = async (data, pwd) => {
	return new Promise((resolve, reject) => {
		try {
			const iv = getIv(data.substring(0, 32))
			const decipher = decipheriv(pwd, iv)
			let decrypted = ''
			decipher.on('readable', () => {
				let chunk
				while (null !== (chunk = decipher.read())) {
					decrypted += chunk.toString('utf8')
				}
			})
			decipher.on('end', () => {
				resolve(decrypted)
			})
			decipher.on('error', reject)
			decipher.write(data.substring(32), 'hex')
			decipher.end()
		} catch (err) {
			reject(err)
		}
	})
}

/**
 * Decrypt string
 *
 * @param {string} src - input data
 * @param {string} pwd - decrypt passphrase
 * @param {string} dest - ouput file path
 * @returns {promise}
 */
const stringDecrypted = async (src, pwd, dest) => {
	try {
		let decrypted = await strDecrypted(src, pwd)
		if (dest) {
			ensureFileSync(dest)
			await writeFileContent(dest, decrypted)
		}
		return decrypted
	} catch (err) {
		logger.error(err)
		return ''
	}
}

/**
 *
 * Decrypt file
 *
 * @param {string} src - input file path
 * @param {string} pwd - decrypt passphrase
 * @param {string} dest - output file path
 * @returns {Promise}
 */
const fileDecrypted = async (src, pwd, dest) => {
	try {
		const encryptedContent = readFileSync(src)
		const iv = getIv(encryptedContent.slice(0, 16))
		const decipher = decipheriv(pwd, iv)
		const input = createReadStream(src, { start: 16 })
		const output = createWriteStream(dest)
		await new Promise((resolve, reject) => {
			input
				.pipe(decipher)
				.pipe(output)
				.on('finish', () => {
					output.close()
					resolve()
				})
				.on('error', reject)
		})
		return true
	} catch (err) {
		logger.error(err)
		removeSync(dest)
		return false
	}
}

export default { stringDecrypted, fileDecrypted }
