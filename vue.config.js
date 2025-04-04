const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions:{
    'style-resources-loader':{
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})

