const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const devNode = process.env.NODE_ENV === 'development';
/**
 * 路径处理
 * @param {*} resolvePath 
 * @returns 
 */
const resolvePath = (resolvePath) => {
    return path.resolve(__dirname, resolvePath);
}
/**
 * css预处理
 */
const styleLoader = [
    devNode ? "style-loader" : MiniCssExtractPlugin.loader ,
    {
        loader: 'css-loader',
        options: {
            modules: true,// 启用 CSS 模块,解决css命名冲突问题，让你放心优雅的写css
            // modules: {
            //     mode: 'local',
            //     // 样式名规则配置
            //     localIdentName: '[name]__[local]--[hash:base64:5]',
            //   },
        }
    },
    {
        loader: "postcss-loader",
        options: {
            postcssOptions: {
            plugins: [
                "postcss-preset-env", // 能解决大多数样式兼容性问题
            ],
            },
        },
    },
]
const baseConfig = {
    entry: resolvePath('../app'),
    output: {
        path: resolvePath('../dist'),
        filename: 'js/[name].[contenthash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [...styleLoader],
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [...styleLoader, "sass-loader"],
                    },
                    {
                        test:/\.(jsx?|tsx?)$/,
                        exclude: /node_modules/, // 排除编译 node_modules
                        use: [
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                }
                            }
                        ],
                    },
                    {
                        test: /\.(tsx?)$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,//处理图片
                        type: "asset/resource",
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024 // 小于10kb的图片会默认被base64处理
                            }
                        },
                        generator: {
                            filename:"static/[name]_[hash][ext]"
                        }
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/i,//处理字体
                        type: 'asset/resource',
                            generator: {
                            filename: 'fonts/[name]_[hash][ext]'
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolvePath('../public/index.html'),
            filename: 'index.html',
            title: 'my app'
        }),
        new ESLintPlugin({
            // fix: true /* 自动帮助修复 */,
            exclude: 'node_modules',
            cache: true,//开启缓存
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css", // 定义抽离的入口文件的文件名
            chunkFilename: "css/[name].[hash].css", // 定义非入口块文件的名称，如动态导入的文件
        }),
        // 显示百分比编译
        new webpack.ProgressPlugin({
            activeModules: false,
            entries: true,
            modules: true,
            modulesCount: 5000,
            profile: false,
            dependencies: true,
            dependenciesCount: 10000,
            percentBy: 'entries',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],//默认省略后缀
        // 解析目录时要使用的文件名
        mainFiles: ["index"],
        alias: {//设置别名
          "@": resolvePath("../src"),
        },
    },
    optimization: {
        //生产环境才会生效
        minimize: !devNode,
        minimizer: [//压缩配置
            new CssMinimizerPlugin(),//压缩css，想在开发环境下启用 CSS 优化，optimization.minimize 设置为 true
        ],
        splitChunks: {//代码分割
          chunks: "all",
          cacheGroups: {
            vendor: {
              // 第三方模块一般处于node_modules中，所以这里缓存 node_modules 中第三方的模块
              test: /[\\/]node_modules[\\/]/, // 缓存node_modules中的文件夹名和文件（文件目录前后可能会有斜线/）
              name: 'vendors',
              chunks: 'all'
            }
          }
        }
          
    },
}
module.exports = {
    baseConfig,
    resolvePath,
}
