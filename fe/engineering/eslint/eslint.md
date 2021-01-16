# ESLint

1. Globals: accessible global variables
1. Environments: an environment is a collection of global variables
1. Rules: a rule describes certain style linting definition.

1. Configuraion files ".eslintrc.json" 或者 "package.json"

```json
// .eslintrc.json
{
  "plugins": ["example"],
  "env": {
    "example/custom": true
  }
}

// package.json
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
    "plugins": ["example"],
    "env": {
      "example/custom": true
    }
  }
}
```

1. Inline configuration
   1. `/*eslint-disable*/` and `/*eslint-enable*/`
   1. `/*global*/`
   1. `/*eslint*/`
   1. `/*eslint-env*/`
1. Command line options:
   1. --global
   1. --rule
   1. --env
   1. -c, --config
1. Project-level configuration:
   1. .eslintrc.\* or package.json file in same directory as linted file
   1. Continue searching for .eslintrc and package.json files in ancestor directories (parent has highest precedence, then grandparent, etc.), up to and including the root directory or until a config with "root": true is found.

In the absence of any configuration from (1) thru (3), fall back to a personal default configuration in ~/.eslintrc.

- eslint-plugin-react
- eslint-plugin-angular
- eslint-plugin-node

1. Specify preset recommended.
1. eslint-watch
1. eslint support ES6/ES7/Object spread by default, use babel-eslint to support experimental features.

```json
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],

  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },

  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },

  "rules": {
    "no-console": 1
  }
}
```

Configuration comments and configuration files

```javascript
/* global var1, var2 */
/* global var1:false, var2: false */

/* eslint eqeqeq: "off", curly: "error" */
/* eslint eqeqeq: 0, curly: 2 */
/* eslint quotes: ["error", "double"], curly: 2 */

/* eslint "plugin1/rule1": "error" */

/* eslint-disable no-alert, no-console */

alert('foo')
console.log('bar')

/* eslint-enable no-alert, no-console */

// disable all ruels
alert('foo') // eslint-disable-line

// eslint-disable-next-line
alert('foo')

alert('foo') // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert('foo')

foo() // eslint-disable-line example/rule-name
```

```JSON
{
  "globals": {
    "var1": true,
    "var2": false
  }
}

{
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"]
  }
}
```
