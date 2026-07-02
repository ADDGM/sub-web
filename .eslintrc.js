module.exports = {
  root: true,
  env: {
    node: true,
    browser: true, // 启用浏览器全局变量（如 window、document）防止报错
    es2021: true // 支持现代 JavaScript 语法（如可选链、空值合并等）
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended' // ⚠️ 必须放在最后！用于关闭与 Prettier 冲突的 ESLint 格式规则
  ],
  rules: {
    // 生产环境禁止残留 debugger，console 建议交给 Vite 的 esbuild.drop 处理，故此处设为 off
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // 关闭 Vue 组件名必须多单词的限制（允许使用 Index.vue, Home.vue）
    'vue/multi-word-component-names': 'off',

    // 在这里统一配置你的 Prettier 视觉样式规则
    'prettier/prettier': [
      'error',
      {
        semi: false, // 句尾不加分号
        singleQuote: true, // 强制使用单引号
        tabWidth: 2, // 缩进使用 2 个空格
        trailingComma: 'none', // 尽可能去掉末尾逗号
        printWidth: 100, // 单行字符超过 100 时才换行
        endOfLine: 'auto' // 自动检测行尾换行符（防止跨系统协同报错）
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 'latest', // 完美适配 Vite 8，无需依赖 Babel 即可解析最新 JS 语法
    sourceType: 'module'
  }
}
