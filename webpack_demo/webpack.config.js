/**
 * Created by diogoxiang on 2016/6/20.
 */
//const webpack = require('webpack');
//module.exports = {
//    entry: './src/app.js',
//    output: {
//        path: './bin',
//        filename: 'app.bundle.js'
//    },
//    module: {
//        loaders: [
//            {test: /\.css$/, loader: "style!css"},
//            {
//                test: /\.js$/,
//                exclude: /node_modules/,
//                loader: 'babel-loader',
//            }
//        ]
//    },
//    plugins: [
//        new webpack.optimize.UglifyJsPlugin({
//            compress: {
//                warnings: false
//            },
//            output: {
//                comments: false
//            }
//        })
//    ]
//
//};


//demo3

//module.exports = {
//    entry: './demo3_babel-loader/main.jsx',
//    output: {
//        filename: './demo3_babel-loader/bundle.js'
//    },
//    module: {
//        loaders: [
//            {
//                test: /\.js[x]?$/,
//                exclude: /node_modules/,
//                loader: 'babel',
//                query: {
//                    presets: ['es2015', 'react']
//                }
//            }
//        ]
//    }
//};

//demo3--------------------


//demo1
var path = require('path');

module.exports = {
    entry: {
        index:'./demo1/js/index'
    },
    externals: [{
        'react-dom':'ReactDOM',
        'react':'React'
    }],
    output: {
        path:path.resolve(__dirname,'demo1'),
        filename: 'app.js'
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                include: path.resolve(__dirname, 'js'),
                loader: 'babel',
                query: {
                    presets: ['es2015','react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias:[
            {'react-dom':'./libs/react-dom.js','react':'./libs/react.js'}
        ]
    }
};