var webpack = require('webpack');//demo5
module.exports = {
  //demo1
  // entry: "./main.js",
  // output: {
  //     filename: 'bundle.js'
  // }

  //demo2
  // entry: {
  //   bundle1 :"./main1.js",
  //   bundle2 :"./main2.js"
  // },
  // output: {
  //     filename: '[name].js'
  // }

  //demo3 &demo 4 &demo5
  entry: {
    bundle :"./main.js",
  },
  output: {
      filename: '[name].js'
  },
  module:{
    loaders:[
      {test : /\.css$/, loader : 'style-loader!css-loader'},
      {test : /\.(png|jpe?g)$/, loader : 'url-loader?limit=8192'},
      // limit ，它的左右是如果图片的大小，小于8192bytes就以Data URL的形式引入图片，大于就用图片地址引用。
    ]
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings:false
      }
    })
  ],
  devServer:{
    contentBase: './', //本地服务器所加载的页面所在的目录
    host: 'localhost', //本地IP地址
    colors: true, //终端输出结果为彩色
    historyApiFallback: true, //不跳转
    // historyApiFallback ：在开发单页时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    inline: true, //实时刷新
    port: '3333' //端口号
  }
}
