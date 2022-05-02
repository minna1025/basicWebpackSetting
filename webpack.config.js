const glob = require("glob");
const path = require("path");

const CopyWebpackPlugin = require ('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

const generateHTMLPlugins = () => 
    glob.sync("./src/**/*.html").map(
        (dir) => 
            new HtmlWebpackPlugin({
                filename: path.basename(dir),
                template: dir
            })
    );

module.exports = {
    mode: "development",
    devServer: {
        static: path.resolve(__dirname, 'src'),
        hot: true,
        open: true
    },
    entry: ["./src/index.js", "./src/sass/main.scss"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'main.js',
        clean: {
            keep: /\.git/
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(sass|scss)$/,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                from: "./src/static/",
                to: "./static/"
                }
            ]
        }),
        ...generateHTMLPlugins(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    stats: {
        colors: true
    },
    devtool: "source-map"
}