const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './js/index.jsx',
        login: './js/login.jsx',
        register: './js/register.jsx'
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
                                      {'plugins': ['@babel/plugin-proposal-class-properties']}],
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
