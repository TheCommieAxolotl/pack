import * as path from 'path';
import 'webpack-dev-server';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const config = {
    mode: 'production',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
};

export default config;
