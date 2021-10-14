import "webpack-dev-server";
import pkg from "./package.json";
import { execSync } from "child_process";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { config } from "dotenv";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import UnusedWebpackPlugin from "unused-webpack-plugin";
import {
    Configuration,
    EnvironmentPlugin,
} from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

config({
    path: process.env.ENV_PATH,
});

const modes: Required<Configuration["mode"]>[] = [
    `development`,
    `production`,
    `none`,
];

const dirtyNodeEnv = process.env.NODE_ENV as Configuration["mode"];
const nodeEnv = (modes.includes(dirtyNodeEnv) ? dirtyNodeEnv : undefined) ?? `production`;
const isDev = nodeEnv === `development`;

const { loadBrandingOptions } = require(`kidsloop-branding`);

const brandingOptions = loadBrandingOptions(process.env.BRAND);

const webpackConfig: Configuration = {
    mode: nodeEnv,
    devtool: isDev ? `eval-cheap-module-source-map` : `source-map`,
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
            ...brandingOptions.webpack.resolve.alias,
        },
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, `dist`),
    },
    plugins: [
        new EnvironmentPlugin({
            VERSION: pkg.version,
            GIT_COMMIT: execSync(`git rev-parse HEAD`).toString().trim().slice(0, 7),
        }),
        new CleanWebpackPlugin(),
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: `src/index.html`,
            ...brandingOptions.webpack.html,
            ...isDev
                ? {}
                : {
                    newRelicAccountID: `3286825`,
                    newRelicAgentID: `322534635`,
                    newRelicTrustKey: `3286825`,
                    newRelicLicenseKey: `NRJS-eff8c9c844416a5083f`,
                    newRelicApplicationID: `322534635`,
                },
        }),
        // new UnusedWebpackPlugin({
        //     // Source directories
        //     directories: [ path.join(__dirname, `src`) ],
        //     // Exclude patterns
        //     exclude: [ `/assets/*`, `*.test.*` ],
        //     // Root directory (optional)
        //     root: __dirname,
        // }),
        // new BundleAnalyzerPlugin(),
    ],
    devServer: {
        host: `fe.alpha.kidsloop.net`,
        port: 8080,
        https: true,
        historyApiFallback: true,
        proxy: {
            "/v1": {
                target: `https://cms.alpha.kidsloop.net/`,
                secure: true,
                changeOrigin: true,
            },
        },
    },
};

export default webpackConfig;
