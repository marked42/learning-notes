# Visual Studio Code

## Debug ES6 javascript

When use default vscode lanuch configuration to debug ES6 javascript, an error will be output to console.

> SyntaxError: Unexpected token import

Which means it doesn't recognize ES6 keyword `import`.
We need to use babel to help debugging ES6 javascript

### babel-register

#### Step 1

Install related packages. `babel-register` is used during development, don't use in production.

| Package             | Explaination          |
| ------------------- | :-------------------- |
| babel-core          | core lib              |
| babel-register      | transpile ES6 in time |
| babel-preset-es2015 | ES6 syntax plugin     |

```bash
npm i -D babel-core babel-register babel-preset-es2015
```

Configure _babel_ in `package.json`

```JSON
{
    // ...
    "devDependencies": {
        "babel-preset-es2015": "^6.18.0",
        "babel-register": "^6.18.0"
    },
    {
        "babel": {
            "presets": [ "es2015" ],
            "sourceMaps": true,
            "retainLines": true
        }
    }
}
```

or `.babelrc`

```JSON
{
    "presets": [ "es2015" ],
    "sourceMaps": true,
    "retainLines": true
}
```

1. `presets` specifies that es2015, aka ES6 is used.
1. `sourceMaps` generate source map allowing us to debug inside source file.
1. `retainLines` retain line numbers.

#### Step 2

Configure vscode launch configuration

```JSON
{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "runtimeArgs": [
        "-r", "babel-register"
    ],
    "program": "${workspaceFolder}/index.js",
    "runtimeExecutable": "node",
    "cwd": "${workspaceFolder}"
}
```

Hopefully, vscode will debug with command below.

```bash
C:\Program Files\nodejs\node.exe --inspect=26213 --debug-brk -r babel-register index.js
```

1. `launch` means to start a new process.
1. `node` is default runtime executable, use `runtimeExecutable` to overwrite it. `runtimeArgs` is paired with runtime executable, it specifies to use `babel-register` to transpile es6 code, it resides after `runtimeExecutable` and before `program` in result command line.
1. `program` is the javascript file to debug, `args` is paired with it to specify command line parameters for it, `args` is at the end.

`args` and `runtimeArgs` are array of strings, note the difference when dealing with options with space.

```JSON
["-r", "babel-register"] -> node -r babel-register
["-r babel-register"]    -> node '-r babel-register'
```

### babel-node

`babel-node` is a wrapper around node using `babel`, it recognizes es6 syntax.

## Debug Jest

```JSON
{
    "type": "node",
    "request": "launch",
    "name": "Jest Tests",
    "program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
    "args": [
        "-i"
    ],
    "internalConsoleOptions": "openOnSessionStart"
}
```

## Debug Electron

### Main Process

### Renderer Process

### Resolve paths

`.` is working directory, it's where the program started in command line.
`__dirname` is script file that contains it.
`__dirname` is folder of `__dianame`

Folder structure of `/dir1/dir2/index.js`,

1. `cd /dir1`, execute `node dir2/index.js`.

   1. `__dirname` resolves to `/dir1/dir2`
   1. `.` resolves to `/dir1`, working direcy.

1. `cd /dir1/dir2`, execute `node index.js`.
   1. `__dirname` is `/dir1/dir2`
   1. `.` resolves to `/dir1/dir2`, working directory.

## Appearance

Color Theme - One Dark Pro
File Icon Theme - vscode-icons
Font - Fira Code

```json
{
  "editor.cursorBlinking": "solid",
  "editor.cursorStyle": "line",
  "editor.fontFamily": "Fira Code",
  "editor.fontLigatures": true,
  "editor.fontSize": 16,
  "editor.lineNumbers": "on",
  "editor.renderIndentGuides": true,
  "editor.rulers": [120],

  "workbench.startupEditor": "welcomePage",
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "vscode-icons",
}
```

## Linting

ESLint, StyleLint, TSLint, MarkdownLint, EditorConfig, Prettier

Install husky to add git hooks directly in package.json file easily. Use lint-staged to lint staged files only.

```bash
yarn add --dev lint-staged husky@next
```

Set up linting configurations.

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.js": ["eslint --fix", "git add"],
        "*.css": "stylelint"
    }
}
```

[Issue 142](https://github.com/okonet/lint-staged/issues/142): duplicate error output when using lint-staged.

## Snippets

Emmet, js-patterns-snippets, VS Code ES7 React/Redux/React-Native/JS snippets,

## Auto Complete

Auto Close Tag, Auto Rename Tag, Path Inteelisense, NPM Intellisense, Intellisense for CSS class names

## Others

Color Highlight, Bracket Pair Colorizer, Project Manager