import { createReadStream, createWriteStream, ensureFileSync } from 'fs-extra'
import { pipeline } from 'stream'
import { promisify } from 'util'

import { writeFileContent } from './fileIo'
import logger from '@/libs/logger'

const { scryptSync, randomFillSync, createCipheriv } = require('crypto')

const pipelineAsync = promisify(pipeline)

const cipheriv = (pwd) => {
	const key = scryptSync(pwd, 'salt', 24)
	const iv = randomFillSync(new Uint8Array(16))
	const cipher = createCipheriv('aes-192-cbc', key, iv)
	cipher.iv = iv
	return cipher
}

const strEncrypted = (data, pwd) => {
	return new Promise((resolve, reject) => {
		try {
			const cipher = cipheriv(pwd)
			let encrypted = ''
			cipher.setEncoding('hex')

			cipher.on('data', (chunk) => (encrypted += chunk))
			cipher.on('end', () => {
				encrypted =
					Buffer.from(cipher.iv.buffer).toString('hex') + encrypted
				resolve(encrypted)
			})
			cipher.write(data)
			cipher.end()
		} catch (err) {
			reject(err)
		}
	})
}

/**
 *
 * encrypt string
 *
 * @param {string} src - input data
 * @param {string} pwd - encrypt passphrase
 * @param {string} dest - output file path
 * @returns {promise}
 */
const stringEncrypted = async (src, pwd, dest) => {
	try {
		let encrypted = await strEncrypted(src, pwd)
		if (dest) {
			ensureFileSync(dest)
			await writeFileContent(dest, encrypted)
		}
		return encrypted
	} catch (err) {
		logger.error(err)
		return ''
	}
}

/**
 * encrypt file
 *
 * @param {string} src - input file path
 * @param {string} pwd - encrypt passphrase
 * @param {string} dest - output file path
 * @returns {promise}
 */
const fileEncrypted = async (src, pwd, dest) => {
	try {
		const cipher = cipheriv(pwd)
		const input = createReadStream(src)
		const output = createWriteStream(dest)

		output.write(Buffer.from(cipher.iv.buffer))
		await pipelineAsync(input, cipher, output)
		output.close()
		return true
	} catch (err) {
		logger.error(err)
		return false
	}
}

export default { stringEncrypted, fileEncrypted }
