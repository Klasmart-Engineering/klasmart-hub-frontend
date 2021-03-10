const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const webpack = require(`webpack`);

module.exports = {
    mode: `development`,
    entry: {
        hubui: `./src/client-entry.tsx`,
        record: `./src/pages/classroom/live/liveClient/entry-record.ts`,
        player: `./src/pages/classroom/live/liveClient/entry-player.ts`,
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
                // use: [
                //     {
                //         loader: "style-loader",
                //     },
                //     "css-modules-typescript-loader",
                //     {
                //         loader: "css-loader",
                //         options: {
                //             modules: true
                //         }
                //     }
                // ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    `file-loader`,
                    {
                        loader: `image-webpack-loader`,
                        options: {
                            // mozjpeg: {
                            //     progressive: true,
                            //     quality: 65
                            // },
                            // // optipng.enabled: false will disable optipng
                            // optipng: {
                            //     enabled: false,
                            // },
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
        filename: `[name].[chunkhash].js`,
        chunkFilename: `[name].[chunkhash].js`,
        path: path.resolve(__dirname, `dist`),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: `index.html`,
            chunks: [ `hubui` ],
            template: `src/index.html`,
        }),
        new HtmlWebpackPlugin({
            filename: `player.html`,
            chunks: [ `player` ],
            template: `src/pages/classroom/live/liveClient/player.html`,
        }),
        new webpack.ProvidePlugin({
            //'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
        new webpack.EnvironmentPlugin({
            STAGE: `inhouse`,
            CN_CMS_ENDPOINT: `https://kl2-test.kidsloop.net/`,
            API_ENDPOINT: `https://api.kidsloop.net/`,
            AUTH_ENDPOINT: `https://auth.kidsloop.net/`,
            LIVE_ENDPOINT: `https://live.kidsloop.net/class-live/`,
            COOKIE_DOMAIN: `kidsloop.net`,
        }),
    ],
    devServer: {
        host: `0.0.0.0`,
        historyApiFallback: true,
        proxy: {
            "/h5p": {
                target: `https://zoo.kidsloop.net/`,
                secure: false,
                changeOrigin: true,
            },
            "/v1": {
                target: `https://seoul-beta.assessment-api.badanamu.net`,
                secure: false,
                changeOrigin: true,
            },
        },
    },
};
