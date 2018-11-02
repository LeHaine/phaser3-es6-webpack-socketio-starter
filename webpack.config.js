var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

// Phaser webpack config
var phaserModule = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(phaserModule, "src/phaser.js");

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || "true"))
});

module.exports = {
    entry: {
        app: ["babel-polyfill", path.resolve(__dirname, "src/main.js")],
        vendor: ["phaser", "webfontloader"]
    },
    devtool: "cheap-source-map",
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, "dist"),
        publicPath: "./dist/",
        filename: "bundle.js"
    },
    watch: true,
    plugins: [
        definePlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor" /* chunkName= */,
            filename: "vendor.bundle.js" /* filename= */
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
            manifest: "./public/manifest.json",
            chunks: ["vendor", "app"],
            chunksSortMode: "manual",
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || "localhost",
            port: process.env.PORT || 3000,
            server: {
                baseDir: ["./", "./dist"]
            },
            target: "http://localhost:8080",
            ws: true
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
