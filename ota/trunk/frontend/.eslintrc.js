module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : "off",
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'strict': 0,
    'no-param-reassign': ["error", { "props": false }],
    'max-len': ["error", { "code": 360 }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }]
  },
  plugins: [
    'html'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
}