// lib/CreateGenerator.js

const ora = require('ora') // Ora 在控制台显示当前加载状态的(下载5.x版本)
const inquirer = require('inquirer') // 用户与命令行交互
const chalk = require('chalk') // ‘粉笔’ 用于设置终端字体颜色的库(下载4.x版本)
const path = require('path')
const child_process = require('child_process')
const extra = require('fs-extra') // fs-extra 是 node fs 的扩展

// 使用 ora 初始化，传入提示信息 message
const spinner = ora()

/**
 * @wrapLoading 交互加载动画
 * @param {*} fn 在 wrapLoading 函数中执行的方法
 * @param {*} message 执行动画时的提示信息
 * @param  {...any} args 传递给 fn 方法的参数
 * @returns
 */
async function wrapLoading(fn, message, ...args) {
  spinner.text = message.loadingMsg
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入的方法 fn
    const result = await fn(...args)
    // 动画修改为成功
    spinner.succeed(message.seccessfulMsg)
    return result
  } catch (error) {
    // 动画修改为失败
    spinner.fail(message.failedMsg + ': ', error)
  }
}

class CreateGenerator {
  constructor(name, targetDir, type) {
    // 目录名称
    this.name = name
    // 创建位置
    this.targetDir = targetDir
    // 创建类型
    this.type = type
    /**
     * 对 download-git-repo 进行 promise 化改造
     * 使用 child_process 的 execSync 方法拉取仓库模板
     */
    this.downloadGitRepo = child_process.execSync
  }

  /**
   * @download 下载远程模板
   */
  async download() {
    // 设置模板下载地址
    let modelUrl = ''
    switch (this.type) {
      case 2:
        modelUrl = `https://github.com/Zeng-xun/Backend-Management-System-Template-vue2-.git`
        break
      case 3:
        modelUrl = ''
        break
      default:
        break
    }
    
    // child_process.spawn 参数
    /**
     * @param masterBranch master分支
     */
    const masterBranch = `git clone -b main ${modelUrl} ${path.resolve(
      process.cwd(),
      this.targetDir
    )}`

    // 调用动画加载效果，加载master分支
    await wrapLoading(
      this.downloadGitRepo,
      {
        loadingMsg: chalk.blue('加载模板中...请耐心等待⌛️'),
        seccessfulMsg: chalk.green('加载成功'),
        failedMsg: chalk.red('加载失败'),
      },
      masterBranch
      //   modelUrl,
      //   path.resolve(process.cwd(), this.targetDir),
    )
  }

  // 核心创建逻辑
  async create() {
    console.log(chalk.black.bold(`名称: ${this.name}`))
    console.log(chalk.black.bold(`目标目录: ${this.targetDir}`))

    await this.download()

    // 写环境变量文件（用在模板编译启动、打包时使用）
    extra.outputFileSync(path.resolve(this.targetDir, '.env'), `PROJECT = ${this.name}`)
  }

  /**
   * 读取路由
   * 统一修改路由中项目路径
   */
  readRoute = async () => {
    const routePath = path.resolve(this.targetDir, 'src', 'pages', this.name, 'route', 'index.ts')
    extra.readFile(routePath, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      console.log(data) // 读取的文件内容
    })
  }

  /**
   * 读取路由
   * 统一修改路由中项目路径
   */
  //   readRoute = async () => {
  //     const routePath = path.resolve(this.targetDir, 'src', 'pages', this.name, 'route', 'index.ts')
  //     extra.readFile(routePath, 'utf8', (err, data) => {
  //       if (err) {
  //         throw err
  //       }
  //       // 将JS源码转换成语法树
  //       let routeDataTree = babelparser.parse(data, {
  //         sourceType: 'module',
  //         plugins: [
  //           'typescript', // 编译tsx文件
  //           // "jsx",         // 编译jsx文件
  //           // "flow",     // 流通过静态类型注释检查代码中的错误。这些类型允许您告诉Flow您希望您的代码如何工作，而Flow将确保它按照这种方式工作。
  //         ],
  //       })
  //       // 遍历和更新节点
  //       traverse(routeDataTree, {
  //         ObjectProperty: (path, state) => {
  //           if (path.node.key.name === 'component') {
  //             path.node.value.value = `@/pages/${this.name}/pages/adjustTheRecord`
  //           }
  //         },
  //       })
  //       // 把AST抽象语法树反解，生成我们常规的代码
  //       const routeCode = generator(routeDataTree).code
  //       extra.outputFileSync(routePath, routeCode)
  //       console.log(routeCode)
  //     })
  //   }
}

module.exports = CreateGenerator
