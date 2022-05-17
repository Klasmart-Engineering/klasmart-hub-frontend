module.exports = function (api) {
    api.cache(true);
    const presets = [
        `@babel/preset-env`,
        [
            `@babel/preset-react`,
            {
                runtime: `automatic`,
            },
        ],
        `@babel/preset-typescript`,
    ];

    const plugins = [
        `@babel/proposal-class-properties`,
        `@babel/proposal-object-rest-spread`,
        `@babel/plugin-transform-object-assign`,
        `@babel/plugin-proposal-optional-chaining`,
        `@babel/plugin-proposal-nullish-coalescing-operator`,
    ];

    return {
        presets,
        plugins,
    };
};
