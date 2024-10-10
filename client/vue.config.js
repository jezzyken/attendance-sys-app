
const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = "Attendance System";
      return args;
    });
  },
  outputDir: path.resolve(__dirname,'../../backend/public'),
})
