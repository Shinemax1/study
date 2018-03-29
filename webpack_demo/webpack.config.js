import { dirname } from 'path';

const path = require('path');
module.exports = {
    entry: {
        entry: './src/entry.js',
        entry2: './src/entry2.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js'
    },
    module: {},
    plugins: [],
    devServer: {
        contentbase: path.resolve(__dirname,'webpack_demo'),
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        port: '1212'
    }
}