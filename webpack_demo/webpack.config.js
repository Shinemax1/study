const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
//需要同步检查html模板
const glob = require('glob');
//使用PurifyCSS可以大大减少CSS冗余
const PurifyCSSPlugin = require("purifycss-webpack");
//打包时保留这些静态资源，直接打包到制定文件夹
const copyWebpackPlugin = require("copy-webpack-plugin");
//node语法,用以输出判断是开发模式还是生产模式
console.log(encodeURIComponent(process.env.type));
if (process.env.type == 'product') {
    //解决css路径不正确，处理静态文件的绝对路径
    var website = {
        publicPath: "http://192.168.0.105:1212/"
    }
} else {
    //解决css路径不正确，处理静态文件的绝对路径
    var website = {
        publicPath: "http://localhost:1212/"
    }
}
module.exports = {
    //source-map 行列 大型项目
    //cheap-module-source-map 行 没列
    //eval-source-map 行列 中小型项目
    //cheap-module-eval-source-map 行 没列 都是开发阶段使用
    devtool: 'eval-source-map',
    //入口文件的配置项
    entry: {
        entry: './src/entry.js',
        entry2: './src/entry2.js',
        //第三方库，用以分离
        jquery: 'jquery',
        vue: 'vue'
    },
    //出口文件的配置项
    output: {
        //输出的路径，用了Node语法
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        //主要作用就是处理静态文件路径的。可以使用temp直接从缓存取
        publicPath: website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module: {
        rules: [{
            test: /\.css$/,
            //把css打包到js中,从右往左顺序不能变
            //use: ['style-loader', 'css-loader']
            //include/exclude//query

            //css分离，不让他打包在js里，官方不认可
            use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        importLoaders: 1
                    }
                }, "postcss-loader"]
            })
        }, {
            //打包图片，可以设置打包的大小限制，决定打包成base64还是路径引用
            test: /\.(png|jpg|gif)/,
            use: [{
                //url-loader里面已经带了file-loader
                loader: 'url-loader',
                options: {
                    limit: 1,
                    outputPath: "images/"
                }
            }]
        }, {
            //打包html中的img标签里的图片路径
            test: /\.(htm|html)$/i,
            use: ['html-withimg-loader']
        }, {
            //打包less文件
            test: /\.less$/,
            use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader', 'less-loader']
            })
            //use: ['style-loader', 'css-loader', 'less-loader']
        }, {
            //打包scss文件
            test: /\.scss$/,
            use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader', 'sass-loader']
            })
            //use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            //babel配置
            test: /\.(jsx|js)$/,
            use: [{
                // cacheDirectory是用来缓存编译结果，下次编译加速
                loader: 'babel-loader?cacheDirectory=true',
                //有了.babelrc文件后不需要
                // options: {
                //     presets: ["es2015","react"]
                // }
            }],
            exclude: /node_modules/
        }]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        //压缩js
        //new uglify(),

        //minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
        //hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
        //template：是要打包的html模版路径和文件名称。
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './index.html'
        }),
        //分离css文件到指定目录
        new extractTextPlugin('/css/index.css'),
        //减少css文件的冗余
        new PurifyCSSPlugin({
            //设置解析路径
            paths: glob.sync(path.join(__dirname, '/*.html')),
        }),
        //全局引入jQuery
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        //添加版权声明
        new webpack.BannerPlugin('大家好，我是渣渣辉'),
        //把第三方库从js文件中分离出来
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery
            name: ['jquery', 'vue'],
            //把文件打包到哪里，是一个路径
            filename: "assets/js/[name].js",
            //最小打包的文件模块数，这里直接写2就好
            minChunks: 2
        }),
        //from:要打包的静态资源目录地址，这里的__dirname是指项目目录下，是node的一种语法，可以直接定位到本机的项目目录中。
        //要打包到的文件夹路径，跟随output配置中的目录。所以不需要再自己加__dirname。
        new copyWebpackPlugin([{
            from: __dirname + '/src/public',
            to: './public'
        }]),
        //热加更新，刷新整个页面而不是局部
        new webpack.HotModuleReplacementPlugin()
    ],
    //配置webpack开发服务功能
    devServer: {
        //从路径中取
        contentBase: path.resolve(__dirname, './'),
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        port: '1212',
        //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。
        historyApiFallback: true
    },
    //watch模式，不用每次都build
    watchOptions: {
        //检测修改的时间，以毫秒为单位
        poll: 1000,
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout: 500,
        //不监听的目录
        ignored: /node_modules/
    }
}