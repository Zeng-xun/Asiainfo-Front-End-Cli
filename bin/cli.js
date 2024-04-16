#! /usr/bin/env node

const { Command } = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')

const program = new Command()

// 定义创建项目
program
  .command('create <projectName>')
  .description('create a new project, 创建一个新项目')
  .option('-f, --force', '如果创建的目录存在则直接覆盖')
  .action((name, option) => {
    console.log(
      chalk.yellow(
        figlet.textSync('ASIAINFO CLI', {
          horizontalLayout: 'full',
        })
      )
    )
    // 引入create.js 模块并传递参数
    require('../lib/create')(name, option)
  })

// 配置版本信息
program
  .version(`v${require('../package.json').version}`)
  .description('使用说明')
  .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv)
