import child_process from 'child_process'

const { exec } = child_process

export default async function shellExec(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error) => {
			if (error) {
				reject(error)
			}
			resolve()
		})
	})
}
