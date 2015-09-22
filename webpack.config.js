var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");
var glob = require("glob");
var sassLoaders = [
"css-loader",
"autoprefixer-loader",
"sass-loader"
];
var entries = [
'./app/scss/main.scss',
'./app/js/router/Router.js',
'./app/index.html'
]
.concat(glob.sync('./app/images/*'));



var IxInternetPortal = {
    entry: entries,
    module: {
        loaders: [
        {
            test: /\html?$/,
            loader: "file?name=../[name].[ext]"
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", sassLoaders.join("!"))
        },
        {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.ico$/,
            loader: "file?name=../img/[name].[ext]"
        },
        {
            test: /\.jsx?$/,
            loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        }
        ]
    },
    output: {
        path: path.join(__dirname, "build/js"),
        filename: "[name].js"
    },
    plugins: [
    new ExtractTextPlugin('../css/main.css'),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // })
    ]
};

module.exports = IxInternetPortal;
