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
import webpack, {
    Configuration,
    EnvironmentPlugin,
} from "webpack";
import zlib from "zlib";

config();

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
        hubui: `./src/bootstrap.ts`,
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
        new webpack.container.ModuleFederationPlugin({
            name: `hub`,
            filename: `remoteEntry.js`,
            remotes: {
                schedule: `schedule@${process.env.SCHEDULE_FRONTEND_URL}/remoteEntry.js`,
                reports: `reports@https://fe.alpha.kidsloop.net:8082/remoteEntry.js`,
                assessment: `assessment@${process.env.ASSESSMENT_FRONTEND_URL}/remoteEntry.js`,
            },
            shared: {
                '@kl-engineering/frontend-state': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`@kl-engineering/frontend-state`],
                },
                react: {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`react`],
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`react-dom`],
                },
                'react-intl': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`react-intl`],
                },
                'react-cookie': {
                    singleton: true,
                },
                '@mui/icons-material': {
                    singleton: true,
                },
                '@mui/lab': {
                    singleton: true,
                },
                '@mui/material': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`@mui/material`],
                },
                '@mui/styles': {
                    singleton: true,
                },
                '@kl-engineering/reports-api-client': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`@kl-engineering/reports-api-client`],
                },
                '@kl-engineering/cms-api-client': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`@kl-engineering/cms-api-client`],
                },
                '@kl-engineering/kidsloop-px': {
                    singleton: true,
                },
                lodash: {
                    singleton: true,
                },
                '@emotion/styled': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`@emotion/styled`],
                },
                '@emotion/react': {
                    singleton: true,
                    requiredVersion: pkg.dependencies[`@emotion/react`],
                },
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
    },
};

export default webpackConfig;
