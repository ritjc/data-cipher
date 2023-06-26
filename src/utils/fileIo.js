import fs from 'fs-extra'

export const getFileContent = async (filePath) => {
	return await fs.readFileSync(filePath, 'utf8')
}

export const writeFileContent = async (filePath, content) => {
	return await fs.writeFileSync(filePath, content, 'utf8')
}
