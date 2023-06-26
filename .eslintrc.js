module.exports = {
	root: true,
	env: {
		commonjs: true,
		es6: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 10,
		sourceType: 'module',
	},
	parser: 'babel-eslint',
	extends: ['eslint:recommended'],
	rules: {
		semi: ['error', 'never'],
		'no-console': 'off',
		'require-atomic-updates': 'off',
	},
}
