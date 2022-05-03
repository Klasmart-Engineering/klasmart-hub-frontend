/* eslint-disable @typescript-eslint/naming-convention */
import "webpack-dev-server";
import pkg from "./package.json";
import { execSync } from "child_process";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { config } from "dotenv";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import UnusedWebpackPlugin from "unused-webpack-plugin";
import {
    Configuration,
    EnvironmentPlugin,
} from "webpack";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import zlib from "zlib";

config({
    path: process.env.ENV_PATH,
});

console.log(process.env.SCHEDULE_FRONTEND_URL);

const modes: Required<Configuration["mode"]>[] = [
    `development`,
    `production`,
    `none`,
];

const dirtyNodeEnv = process.env.NODE_ENV as Configuration["mode"];
const nodeEnv = (modes.includes(dirtyNodeEnv) ? dirtyNodeEnv : undefined) ?? `production`;
const isDev = nodeEnv === `development`;

const { loadBrandingOptions } = require(`@kl-engineering/kidsloop-branding`);

const brandingOptions = loadBrandingOptions(process.env.BRAND);

const webpackConfig: Configuration = {
    mode: nodeEnv,
    devtool: isDev ? `eval-cheap-module-source-map` : `source-map`,
    entry: {
        hubui: `./src/index.ts`,
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "@": path.resolve(__dirname, `src`),
            ...brandingOptions.webpack.resolve.alias,
        },
    },
    output: {
        filename: `[name].[contenthash].js`,
        chunkFilename: `bundles/[name].[contenthash].js`,
        path: path.resolve(__dirname, `dist`),
    },
    plugins: [
        new EnvironmentPlugin({
            VERSION: pkg.version,
            GIT_COMMIT: execSync(`git rev-parse HEAD`)
                .toString()
                .trim()
                .slice(0, 7),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `public`,
                    to: ``, // not `dist` as it will then be place at `dist/dist`
                },
            ],
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
        new ModuleFederationPlugin({
            name: `hub`,
            filename: `remoteEntry.js`,
            remotes: {
                schedule: `schedule@${process.env.SCHEDULE_FRONTEND_URL}/remoteEntry.js`,
            },
            shared: {
                '@kl-engineering/frontend-state': {
                    singleton: true,
                    // requiredVersion: pkg.dependencies[`@kl-engineering/frontend-state`],
                },
                // recoil: {},
                // 'react-cookie': {},
                react: {
                    // eager: true,
                    singleton: true,
                    requiredVersion: pkg.dependencies[`react`],
                },
                'react-dom': {
                    // eager: true,
                    singleton: true,
                    requiredVersion: pkg.dependencies[`react-dom`],
                },
            },
        }),
        ...isDev
            ? []
            : [
                new CompressionPlugin({
                    filename: `[path][base].gz`,
                    algorithm: `gzip`,
                    compressionOptions: {
                        level: 9,
                    },
                    test: /\.(js|css|html|svg|ttf)$/,
                }),
                new CompressionPlugin({
                    filename: `[path][base].br`,
                    algorithm: `brotliCompress`,
                    compressionOptions: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                    },
                    test: /\.(js|css|html|svg|otf|ttf)$/,
                }),
            ],
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
    optimization: {
        moduleIds: `deterministic`,
        runtimeChunk: `single`,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name (module: { context: { match: (arg0: RegExp) => any[] } }) {

                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `${packageName.replace(`@`, ``)}`;
                    },
                    chunks: `all`,
                },
            },
            chunks: `all`,
        },
    },
    devServer: {
        host: `fe.alpha.kidsloop.net`,
        port: 8080,
        https: true,
        historyApiFallback: true,
        client: {
            overlay: {
                warnings: false,
            },
        },
        // proxy: {
        //     // eslint-disable-next-line @typescript-eslint/naming-convention
        //     "/v1": {
        //         target: `https://cms.alpha.kidsloop.net/`,
        //         secure: true,
        //         changeOrigin: true,
        //     },
        // },
    },
};

export default webpackConfig;
