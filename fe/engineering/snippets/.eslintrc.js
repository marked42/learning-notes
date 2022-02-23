module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    // must be last one, disable any eslint rules that clashes with prettier
    'prettier',
    'prettier/react',
  ],
  plugins: ['react', 'jsx-a11y', 'import', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        jsxBracketSameLine: false,
        parser: 'babylon',
        printWidth: 80,
        // default is true
        semi: false,
        // default is false
        singleQuote: true,
        tabWidth: 2,
        // default is 'none'
        trailingComma: 'all',
        useTabs: false,
      },
    ],
    // no more than 10 switch case, loops and callbacks totally inside function
    complexity: [2, 10],
    // no more than 4 level of nested for, if-else
    'max-depth': [2, 4],
    // no more than 3 level of callbacks, use async/await
    'max-nested-callbacks': [2, 3],
    // no more than 5 paramters for one function
    'max-params': [2, 5],
    // no more than 50 lines of code for one function
    'max-statements': [2, 50],
    // semi: [2, "never"],
    // "comma-dangle": [2, "always-multiline"],
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
}