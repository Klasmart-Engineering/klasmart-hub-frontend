const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const webpack = require(`webpack`);
const UnusedWebpackPlugin = require(`unused-webpack-plugin`);

module.exports = {
    mode: `development`,
    entry: {
        ui: `./src/client-entry.tsx`,
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
                use: [`style-loader`, `css-loader`],
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
                                quality: [0.65, 0.90],
                                speed: 4,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [`file-loader`],
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
        new HtmlWebpackPlugin({
            template: `src/index.html`,
        }),
        new webpack.EnvironmentPlugin({
            STAGE: `dev`,
            CN_CMS_ENDPOINT: `https://kl2-test.kidsloop.net/`,
            API_ENDPOINT: `https://api.kidsloop.net/`,
            AUTH_ENDPOINT: `https://auth.kidsloop.net/`,
            LIVE_ENDPOINT: `https://live.kidsloop.net/class-live/`,
            COOKIE_DOMAIN: `kidsloop.net`,
        }),
        new UnusedWebpackPlugin({
            // Source directories
            directories: [path.join(__dirname, `src`)],
            // Exclude patterns
            exclude: [`/assets/*`],
            // Root directory (optional)
            root: __dirname,
        }),
    ],
    devServer: {
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
    },
};
