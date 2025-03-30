module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  globals: {
    defineProps: 'readonly'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //放宽对空行数量限制
    'no-multiple-empty-lines': 'off',
    'spaced-comment': 'off',
    'no-trailing-spaces': 'off',
    'object-curly-spacing': 'off',
    'no-unused-vars': 'off', // 禁用变量未使用的bug
    //禁用对缩进字数的限制
    indent: 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    //禁用文件名必须是多个word
    'vue/multi-word-component-names': 'off',
    //禁用必须在文件末尾添加换行符
    'eol-last': 'off',
    // 禁用键值对之间的空格规则
    'key-spacing': 'off',
    // 禁用操作符周围的空格规则
    'space-infix': 'off',
    // 禁用一元操作符后的空格规则
    'space-unary': 'off',
    // 禁用块内的空格规则
    'space-in-braces': 'off',
    // 禁用括号内的空格规则
    'space-in-parens': 'off',
    // 禁用关键字后的空格规则
    'keyword-spacing': 'off',
    // 禁用其他与空格相关的规则
    'semi-spacing': 'off',
    'space-before-blocks': 'off',
    'space-return-throw-case': 'off'
  }
}
