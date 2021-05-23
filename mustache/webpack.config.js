const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    // publicPath 虚拟打包路径，文件夹不会真正生成
    publicPath: 'xuni',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'www'),
    compress: false,
    port: 8080,
    publicPath: '/xuni/',
  }
};