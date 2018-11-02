var path = require("path");
var webpack = require("webpack");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var WorkboxPlugin = require("workbox-webpack-plugin");

// Phaser webpack config
var phaserModule = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(phaserModule, "src/phaser.js");

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || "false"))
});

module.exports = {
    entry: {
        app: ["babel-polyfill", path.resolve(__dirname, "src/main.js")],
        vendor: ["phaser", "webfontloader"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "./",
        filename: "js/bundle.js"
    },
    plugins: [
        definePlugin,
        new CleanWebpackPlugin(["build"]),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
            drop_console: true,
            minimize: true,
            output: {
                comments: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor" /* chunkName= */,
            filename: "js/vendor.bundle.js" /* filename= */
        }),
        new HtmlWebpackPlugin({
            filename: "index.html", // path.resolve(__dirname, 'build', 'index.html'),
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
            manifest: "./public/manifest.json",
            chunks: ["vendor", "app"],
            chunksSortMode: "manual",
            hash: true
        }),
        new CopyWebpackPlugin([{ from: "assets", to: "assets" }]),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        })
    ],
    module: {
        rules: [
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve("file-loader"),
                options: {
                    name: "/assets/[name].[hash:8].[ext]"
                }
            },
            {
                test: /\.js$/,
                use: ["babel-loader"],
                include: path.join(__dirname, "src")
            },
            { test: /phaser-split\.js$/, use: ["expose-loader?Phaser"] }
        ]
    },
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty"
    },
    resolve: {
        alias: {
            phaser: phaser
        }
    }
};
