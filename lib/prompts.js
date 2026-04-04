// lib/prompts.js
import prompts from 'prompts'

export async function getProjectName (fs, path) {
  while(true) {
    const res = await prompts({
      type: 'text',
      name: 'projectName',
      message: '📦 项目名称',
      validate: v => v ? true : '项目名不能为空'
    })
    const name = res.projectName
    if(!name) process.exit(1)
    const targetDir = path.resolve(process.cwd(), name)
    if(fs.existsSync(targetDir)) {
      console.log('❌ 目录已存在，请重新输入')
      continue
    }
    return name
  }
}

export async function chooseLanguage () {
  const { language } = await prompts({
    type: 'select',
    name: 'language',
    message: '请选择项目语言',
    choices: [
      { title: 'JavaScript', value: 'js' },
      { title: 'TypeScript', value: 'ts' }
    ]
  })
  return language
}

export async function chooseFeatures () {
  const { featureList } = await prompts({
    type: 'multiselect',
    name: 'featureList',
    message: '请选择基础功能（↑↓选择，空格确认，回车完成）',
    instructions: false,
    choices: [
      { title: 'Pinia（含持久化）', value: 'pinia' },
      { title: 'Axios', value: 'axios' },
      { title: 'uView Pro（UI组件库）', value: 'uview-pro' },
      { title: 'VueUse（实用 Composition API）', value: 'vueuse' },
      { title: 'Lodash（工具库）', value: 'lodash' },
      { title: 'Day.js（日期处理）', value: 'dayjs' },
      { title: 'mitt（事件总线）', value: 'mitt' },
      { title: 'HTTPS（mkcert）', value: 'https' }
    ]
  })
  return featureList || []
}

export async function askRunDev (devCommand) {
  const { runDev } = await prompts({
    type: 'select',
    name: 'runDev',
    message: `是否立即运行 ${devCommand}？`,
    choices: [{ title: 'Yes', value: true }, { title: 'No', value: false }]
  })
  return runDev
}