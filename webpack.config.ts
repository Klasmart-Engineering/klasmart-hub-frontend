/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'webpack-dev-server';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import UnusedWebpackPlugin from "unused-webpack-plugin";
import {
    Configuration,
    EnvironmentPlugin,
} from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const modes = [
    `development`,
    `production`,
    `none`,
] as const;
type Mode = typeof modes[number]

const dirtyNodeEnv = process.env.NODE_ENV as Mode;
const nodeEnv = (modes.includes(dirtyNodeEnv) ? dirtyNodeEnv : undefined) ?? `production`;
const isDev = nodeEnv === `development`;

const config: Configuration = {
    mode: nodeEnv,
    entry: {
        hubui: `./src/client-entry.tsx`,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: `babel-loader`,
                },
            },
            {
                test: /\.css$/i,
                use: [ `style-loader`, `css-loader` ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    `file-loader`,
                    {
                        loader: `image-webpack-loader`,
                        options: {
                            pngquant: {
                                quality: [ 0.65, 0.90 ],
                                speed: 4,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [ `file-loader` ],
            },
            {
                test: /\.mp4$/,
                use: `file-loader?name=videos/[name].[ext]`,
            },
        ],
    },
    resolve: {
        extensions: [
            `.js`,
            `.jsx`,
            `.tsx`,
            `.ts`,
        ],
        alias: {
            react: path.resolve(`./node_modules/react`),
            "@": path.resolve(__dirname, `src`),
        },
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, `dist`),
    },
    plugins: [
        // @ts-ignore
        // new BundleAnalyzerPlugin(),
        // @ts-ignore
        new CleanWebpackPlugin(),
        // @ts-ignore
        process.env.ENV_PATH
            ? new Dotenv({
                path: process.env.ENV_PATH,
            })
            : new EnvironmentPlugin({
                CN_CMS_ENDPOINT: process.env.CN_CMS_ENDPOINT,
                API_ENDPOINT: process.env.API_ENDPOINT,
                AUTH_ENDPOINT: process.env.AUTH_ENDPOINT,
                LIVE_ENDPOINT: process.env.LIVE_ENDPOINT,
                COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
            }),
        new HtmlWebpackPlugin({
            template: isDev ? `src/index.html` : `src/index_prod.html`,
        }),
        // @ts-ignore
        new UnusedWebpackPlugin({
            // Source directories
            directories: [ path.join(__dirname, `src`) ],
            // Exclude patterns
            exclude: [ `/assets/*` ],
            // Root directory (optional)
            root: __dirname,
        }),
    ],
    devServer: isDev ? {
        host: `fe.kidsloop.net`,
        port: 8080,
        https: true,
        historyApiFallback: true,
        proxy: {
            "/v1": {
                target: `https://kl2-test.kidsloop.net/`,
                changeOrigin: true,
            },
            "/h5p": {
                target: `https://kl2-test.kidsloop.net/`,
                secure: true,
                changeOrigin: true,
            },
        },
    } : undefined,
};

export default config;
