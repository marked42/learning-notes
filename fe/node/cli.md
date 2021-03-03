# 命令行工具

## shell 脚本

类 unix 系统中 shell 执行命令`flow hello`时，首先在`$PATH`环境变量指定的若干个路径下寻找第一个参数`flow`同名的文件。
不存在同名文件时报错提示命令找不到`command not found`。

同名文件存在可能有两种情况，二进制文件，可执行且有权限才能正常运行。脚本文件（纯文本）第一行没有使用`#`标记，则使用当前环境变量`$SHELL`指定的 shell 执行该脚本文件。否则使用第一行`#!`标记指定的解释器来执行脚本。

```
#!/usr/local/bin/node
```

解释器必须是正确的绝对路径，不存在时提示错误“bad interpreter: No such file or directory”，没有执行权限的话提示“bad interpreter: Permission denied”。不会在$PATH 变量路径中寻找解释器，所以下面的写法不行。

```bash
#!node
```

但是`node`命令安装的具体位置是不确定的，所以可以使用系统自带的`env`命令来执行任意可执行程序。

```bash
#!/usr/bin/env node --arg1 --arg2
```

假设命令`flow`执行的 JS 脚本文件`~/flow.js`，`flow hello world`相当于

```bash
/usr/bin/node --cpu-prof /Users/tom/flow.js hello world
```

解释器文件和脚本文件都会被展开为绝对路径，参考`env`手册（`man env`）。

```bash
argv[0] = '/usr/bin/node'
argv[1] = '--arg1 --arg2'
argv[2] = '/Users/tom/flow.js'
argv[3] = 'hello'
argv[4] = 'world'
```

注意其中`--arg1 --arg2`默认被合并为一个参数，可以使用`-S`选项将其拆开。

```bash
#!/usr/bin/env -S node --arg1 --arg2
```

相当于

```bash
argv[0] = '/usr/bin/node'
argv[1] = '--arg1'
argv[2] = '--arg2'
argv[3] = '/Users/tom/flow.js'
argv[4] = 'hello'
argv[5] = 'world'
```

## `package.json#bin`

NPM 包通过`package.json`文件的`bin`[字段](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin)提供 JS 文件作为可执行的脚本文件。
该包安装时会在全局（`/usr/bin/myapp`）或者局部（`node_modules/.bin/myapp`）创建同名连接文件指向对应 脚本文件。

```json
{
  "bin": {
    "myapp": "./cli.js"
  }
}
```

如果整个包直到出一个与包名**同名**的脚本文件，`bin`可以是一个字符串指向脚本文件路径。

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": "./path/to/program"
}
```

相当于

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": {
    "my-program": "./path/to/program"
  }
}
```

注意 Node 脚本文件必须使用`!#/usr/bin/env node`指定 Node 来解释执行脚本文件。

## minimist 命令行参数解析

使用`minimist`对脚本命令行参数解析，适合用来实现参数不是太复杂的命令行工具。

```bash
#!/usr/bin/env node

const parse = require('minimist');
const argv = parse(process.argv.slice(2));
```

命令行参数分为两种：

1. 选项参数 - 以`-`开头的短选项或者`--`开头的长选项，选项有名称和值
1. 其余普通参数

命令`node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz`解析结果如下。

```js
{ _: [ 'foo', 'bar', 'baz' ],
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: 'boop' }
```

```js
// { x: true }
parse('-x')

// { x: 3 }
parse('-x3')
parse('-x 3')
parse('-x=3')

// { x: 'true' }
parse('-x=true')

// { x: true }
parse('-x')
// { x: true, y: true}
parse('-xy')
// { x: true, y: true, z: true }
parse('-xyz')

// { x: '-y' }
parse('-x-y')
// { x: '-yz' }
parse('-x-yz')

// { x: true, y: '-z' }
parse('-xy-z')

// { test: false }
parse('--no-test')
```

默认的解析参数格式。

1. 默认选项参数空格分隔的下一参数作为选项的值，两者解析为一个键值对。
1. 选项参数没有下以参数配对时其值默认解析为`true`，否则解析为数字或者字符串。
1. `-xy-z` 短选项从第一个非字母的字符之前每个字符都是一个选项名，只有最后一个选项`y`有配对的选项值`-z`，`x`没有对应值，值解析为`true`。
1. `-x=3` 等号形式`=`后面的作为选项配对的值
1. `--enable-update` 形式的长选项只表示一个选项，名称是`--`后面的部分，不会像短选项一样产生多个选项。
1. 其余不带`-`或者`--`选项的解析为数组字符串，保存在`argv._`字段中。

选项参数和普通参数先后顺序不影响选项解析结果，普通参数在`argv._`按照先后顺序排列。

使用`parse(process.argv, opts = {})`第二个参数指定解析格式配置，参考[文档](https://github.com/substack/minimist/blob/master/index.js)

1. `opts.string: string | string[]` - 指定名称选项值解析为字符串
1. `opts.boolean: boolean | string | string[]` - `true`时`--test`形式解析为布尔值，不影响其他形式。字符串类型指定选项解析为布尔值。
1. `opts.alias: { [key: string]: string | string[] } ` - 指定选项名的别名，解析获得原选项与所有别名的值是相同，适用与为单字母选项`('-n tom', { alias: { n: 'name' })`提供合适的解析名称`{ name: 'tom', n: 'tom' }`。
1. `opts.stopEarly` - 值为`true`是表示提前结束选项解析，从第一个不是选项的参数开始不再进行更多解析，全部保存到`argv._`中。
1. `opts.default` - 为选项提供默认值
1. `opts['--']` - 值为`true`时，`argv._`保存`--`之前的参数，`argv['--']`保存`--`之后的参数。
   ```js
   > require('./')('one two three -- four five --six'.split(' '), { '--': true })
   { _: [ 'one', 'two', 'three' ],
     '--': [ 'four', 'five', '--six' ] }
   ```
1. `opts.unknown: (v: string) => boolean` - 没有在`opts`中配置的选项名是未知选项（unknown）,这些未知选项默认保存在解析的结果中，`unknown('name')`返回`false`表示要忽略未知选项`name`，不输出到结果中。

## commander

完整的命令行工具库

## 终端文字效果

1. [chalk](https://github.com/chalk/chalk#modifiers) 终端文字效果包括颜色、背景色、下划线、粗体、斜体等效果和 256 真彩色支持。可以适用多种方式指定颜色，参考[文档](https://github.com/chalk/chalk#styles)

   ```js
   const chalk = require('chalk')

   // 支持链式，嵌套调用
   console.log(chalk.blue('Hello', chalk.red.bold('world', '!')))
   ```

1. [chalk-animation](https://github.com/bokub/chalk-animation) 终端文字动画
1. [terminal-link](https://github.com/sindresorhus/terminal-link) 终端文字链接
1. boxen - 文字边框
1. [ora](https://github.com/sindresorhus/ora) - 进行中状态
1. [progress](https://github.com/visionmedia/node-progress) - 进度条
1. [listr](https://github.com/SamVerschueren/listr) - 任务列表
1. [svg-term-cli](https://github.com/marionebl/svg-term-cli) svg转换成终端文字动画

## 终端交互

[inquirer](https://www.npmjs.com/package/inquirer)提供了在终端与用户进行问答式交互的方法，支持 list、rawlist、expand、checkbox、confirm、input、number、editor 的方式。

使用`inquirer.prompt()`提出问题。

```js
const { action } = await inquirer.prompt([
  {
    // 该问题答案存储的字段名
    name: 'action',
    // 列表问题
    type: 'list',
    // 当前问题是否展示给用户，函数参数接受当前的回答数据（answer）作为第一个参数，并且返回boolean
    // boolean | (answers: {}) => boolean | Promise<boolean>
    when: true,
    // 判断用户输入input是否合法
    // (input, answers) => boolean | Promise<boolean>
    validate: (input, answers) => true,
    // 对用户输入做转换，转换的值保存到answer中
    filter: (input, answers) => input,
    // 返回结果展示用户，不影响answer的数据
    transformer: (input, answers, options) => input,
    // 问题内容
    message: `Target directory ${chalk.cyan(
      targetDir
    )} already exists. Pick an action:`,
    // 可选列表
    choices: [
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Merge', value: 'merge' },
      // 分隔符
      new inquirer.Separator(),
      { name: 'Cancel', value: false },
    ],
    // 列表数据
    pageSize: 3,
    // 默认值，列表循环展示
    loop: true,

    // 默认值
    default: false,

    prefix: '',
    suffix: '',
    // 答案中已经有的问题强制再次回答
    askAnswered: true,
  },
])
```

使用`inquirer.registerPrompt(name, prompt)`可以注册新的问题类型（会覆盖已有类型），`name`参数对应问题的`type`字段。

问题类型新增或者修改后会影响当前`prompt`模块后续所有`prompt()`调用，可以使用`inquirer.createPromptModule() -> prompt function`创建一个独立的`prompt`函数模块，对应的问题类型与`inquirer.prompt`和其他模块互不影响。

## get-port

[get-port](https://github.com/sindresorhus/get-port)在端口被占用时获取一个新端口。

## fs-extra

[fs-extra](https://github.com/jprichardson/node-fs-extra)

## exec

子进程执行其他命令。

exec
execa

```js
const execa = require('execa')
const binPath = require.resolve('@vue/cli/bin/vue.js')

execa(
  binPath,
  process.argv
    .slice(process.argv.indexOf('create'))
    .concat(['--preset', '--clone']),
  { stdio: 'inherit' }
)
```
