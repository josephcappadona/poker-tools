const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        home: './js/home.jsx',
        login: './js/login.jsx',
        register: './js/register.jsx',
        settings: './js/settings.jsx',
        play: './js/play.jsx',
        rejam: './js/rejam.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env',
                                      '@babel/react',
                                      {'plugins': ['@babel/plugin-proposal-class-properties',
                                                   '@babel/plugin-transform-runtime']}],
                        }
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: ['url-loader'],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].bundle.js',
    },
};
