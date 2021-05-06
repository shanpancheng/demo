const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    // publicPath 虚拟打包路径，文件夹不会真正生成
    publicPath: 'xuni',
    filename: 'bundle.js',
  },
  devServer: {
    port: 8080,
    contentBase: 'www',
  }
};