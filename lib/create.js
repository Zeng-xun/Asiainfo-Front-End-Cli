const path = require('path')
const extra = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const CreateGenerator = require('./CreateGenerator')

module.exports = async function (name, options) {
  const cwd = process.cwd() // 执行目录
  const targetAir = path.join(cwd, name) // 需要创建的目录地址
  // 判断目录是否已经存在？
  if (extra.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await extra.remove(targetAir)
      makeGenerator(name, targetAir)
    } else {
      // 在终端输出询问用户是否覆盖：
      const inquirerParams = [
        {
          name: 'aboutProject',
          type: 'list',
          message: '目标文件目录已经存在，请选择如下操作：',
          choices: [
            { name: '替换当前目录', value: 'replace' },
            { name: '移除已有目录', value: 'remove' },
            { name: '取消当前操作', value: 'cancel' },
          ],
        },
      ]
      let inquirerData = await inquirer.prompt(inquirerParams)
      // console.log('inquirerData', inquirerData)
      if (!inquirerData?.aboutProject) {
        return
      } else if (inquirerData.aboutProject === 'remove') {
        // 移除已存在的目录
        await extra.remove(targetAir)
        console.log('目录 <' + chalk.green(name) + '> 已移除')
      } else if (inquirerData.aboutProject === 'replace') {
        await extra.remove(targetAir)
        makeGenerator(name, targetAir)
      }
    }
  } else {
    makeGenerator(name, targetAir)
  }
}

/**
 * 创建项目
 * @param {string} name 项目名称
 * @param {string} targetAir 需要创建的目录地址
 */
const makeGenerator = async (name, targetAir) => {
  let generator
  // 在终端输出询问用户选择哪种模板：
  const inquirerParams = [
    {
      name: 'type',
      type: 'list',
      message: '请选择你需要的模版：',
      choices: [
        { name: 'Vue2.x + Javascript + Element UI + Webpack', value: 2 },
        { name: 'Vue3.x + Javascript + Naive UI + Vite', value: 3 },
      ],
    },
  ]
  let inquirerData = await inquirer.prompt(inquirerParams)
  if (!inquirerData?.type) {
    return
  } else if (inquirerData.type === 2) {
    generator = new CreateGenerator(name, targetAir, 2)
  } else if (inquirerData.type === 3) {
    console.log(chalk.red('暂无Vue3.x模板，作者还在努力开发中...😁'))
    // makeGenerator(name, targetAir, 3)
    return
  }

  generator.create()
}
