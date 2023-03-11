import * as path from 'path';
import 'webpack-dev-server';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const config = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
};

export default config;
