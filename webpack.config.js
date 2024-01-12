const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const glob = require('glob');

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development';

    return {
        entry: './src/assets/js/index.js',
        output: {
            path: path.resolve(__dirname, 'htdocs'),
            filename: 'assets/js/index.js'
        },
        mode: argv.mode,
        devServer: {
            static: "htdocs",
            open: true,
            liveReload: true,
            watchFiles: ['src/**/*'],
        },
        module: {
            rules: [
                {
                    test: /\.(css|sass|scss)/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader' // SCSSサポートを追加
                        }
                    ]
                },
                {
                    test: /\.pug$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'pug-loader',
                            options: {
                                pretty: true,
                            }
                        }
                    ]
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.pug',
                filename: 'index.html',
                minify: false,
            }),
            //別ページを作る場合
            ...glob.sync('./src/**/*.pug').map((filePath) => {
                return new HtmlWebpackPlugin({
                    template: filePath,
                    filename: path.relative('./src', filePath).replace('.pug', '.html'),
                    minify: false,
                    // htmlにindex.jsやindex.cssを手動で書く場合のみ
                    // // JS2回実行を防ぐ
                    // inject: false, 
                });
            }),

            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: isDevelopment ? [] : ['**/*'],
            }),

            new CopyPlugin({
                patterns: [
                    { from: 'src/assets/images', to: 'assets/images' },
                ],
            }),

            new MiniCssExtractPlugin({ 
                filename: 'assets/css/index.css',
            }),

        ]
    };
};