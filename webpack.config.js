const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "src", "index.js"),
    output: { path: path.join(__dirname, "build"), filename: "index.bundle.js" },
    mode: process.env.NODE_ENV || "development",
    resolve: { modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
        components: path.resolve(__dirname, 'src', 'scripts', 'components'),
        utils: path.resolve(__dirname, 'src', 'scripts', 'utils'),
    } }, 
    devServer: {
        inline:true,
        port: 3000, contentBase: path.join(__dirname, "src"),
        watchContentBase: true, 
        hot: true
      },
      target: 'web',
    module: {
        rules: [
            { 
                test: /\.(js|jsx)$/, 
                exclude: /node_modules/, 
                use: ["babel-loader"] 
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },{
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
              },
            { 
                test: /\.(jpg|jpeg|png|gif|mp3)$/,
                use: ["file-loader"] 
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        inject: true
        }),
    ],
};