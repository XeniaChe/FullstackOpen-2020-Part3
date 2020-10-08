module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'airbnb',
		'prettier'
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12
	},
	plugins: [ 'react', 'prettier' ],
	rules: {
		eqeqeq: 'error',
		'no-trailing-spaces': 'error',
		'object-curly-spacing': [ 'error', 'always' ],
		'arrow-spacing': [ 'error', { before: true, after: true } ],
		quotes: [ 'error', 'single' ],
		'no-console': 0,
		'no-unused-vars': [ 'error', { args: 'none' } ]
	}
};
