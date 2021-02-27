# Shell

binary

`flow.js`

```bash
#!/usr/bin/env node
#!/usr/bin/node
```

`flow hello test` 相当于 `node flow hello test`

```bash
/Users/zhangpenghui/.nvm/versions/node/v12.20.1/bin/node /Users/zhangpenghui/.nvm/versions/node/v12.20.1/bin/flow hello test
```

1. http://smilejay.com/2012/03/linux_shebang/
1. https://zh.wikipedia.org/wiki/Shebang
1. man env
1. https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
1. https://stackabuse.com/executing-shell-commands-with-node-js/

当  `#!/usr/bin/env`不存在时

zsh: /Users/zhangpenghui/.nvm/versions/node/v12.20.1/bin/flow: bad interpreter: /user/bin/env: no such file or directory


package.json.bin https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin


```js
#!/usr/bin/env node

const { semver, error } = require('@vue/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node

if (
  !semver.satisfies(process.version, requiredVersion, {
    includePrerelease: true,
  })
) {
  error(
    `You are using Node ${process.version}, but flow ` +
      `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const { program } = require('commander')
program.version('0.0.1')

program
  .command('create <app-name>')
  .description('create a new frontend scaffold project')
  .action((name, cmd) => {
    const execa = require('execa')
    const binPath = require.resolve('@vue/cli/bin/vue.js')

    execa(
      binPath,
      process.argv
        .slice(process.argv.indexOf('create'))
        .concat([
          '--preset',
          'direct:ssh://git@git.sankuai.com/search-nlp-fe/vue-cli-preset-flow.git',
          '--clone',
          '--registry=http://r.npm.sankuai.com',
        ]),
      { stdio: 'inherit' }
    )
    return

    // TODO:
    const rawArgv = process.argv.slice(2)
    const args = require('minimist')(rawArgv, {
      boolean: [
        // build
        'modern',
        'report',
        'report-json',
        'inline-vue',
        'watch',
        // serve
        'open',
        'copy',
        'https',
        // inspect
        'verbose',
      ],
    })
    const { exec } = require('child_process')

    exec(gg
      `ls -al`,
      // `vue -h`,
      // `vue create ${name} --registry=http://r.npm.sankuai.com`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      }
    )
  })

program.parse(process.argv)
```
