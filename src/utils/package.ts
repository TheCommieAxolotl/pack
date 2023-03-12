export const createPackageJSON = (params: {
    name: string;
    location: string;
    template: 'rollup' | 'vite' | 'webpack' | 'vanilla';
    tools: string[];
    typescript: boolean;
    installDependencies: boolean;
}) => {
    const json = {
        name: params.name,
        version: '0.0.1',
        description: '',
        private: true,
        type: 'module',
        author: '',
        main: 'dist/index.js',
        scripts: {},
        dependencies: {},
        devDependencies: {},
    };

    switch (params.template) {
        case 'rollup':
            json.scripts = {
                build: 'rollup -c',
                dev: 'rollup -c -w',
            };

            json.devDependencies = {
                ...json.devDependencies,
                rollup: '^2.56.3',
                '@rollup/plugin-node-resolve': '^13.0.6',
            };

            if (params.typescript) {
                json.devDependencies = {
                    ...json.devDependencies,
                    typescript: '^4.3.5',
                    tslib: '^2.3.0',
                    '@rollup/plugin-typescript': '^8.2.1',
                };
            }
            break;
        case 'vite':
            json.scripts = {
                build: 'vite build',
                dev: 'vite build --watch',
            };

            json.main = 'dist/index.es.js';

            json.devDependencies = {
                ...json.devDependencies,
                vite: '^2.5.10',
            };

            if (params.typescript) {
                json.devDependencies = {
                    ...json.devDependencies,
                    typescript: '^4.3.5',
                };
            }
            break;
        case 'webpack':
            json.scripts = {
                build: 'webpack',
                dev: 'webpack serve',
            };

            json.devDependencies = {
                ...json.devDependencies,
                webpack: '^5.52.1',
                'webpack-cli': '^4.8.0',
                'webpack-dev-server': '^3.11.2',
            };

            if (params.typescript) {
                json.devDependencies = {
                    ...json.devDependencies,
                    typescript: '^4.3.5',
                    'ts-loader': '^9.2.3',
                };
            }
            break;
        case 'vanilla':
            json.scripts = {
                build: "echo 'No build script specified'",
                dev: "echo 'No dev script specified'",
            };

            json.main = 'src/index.js';

            if (params.typescript) {
                json.devDependencies = {
                    ...json.devDependencies,
                    typescript: '^4.3.5',
                };

                json.scripts = {
                    ...json.scripts,
                    build: 'tsc',
                    dev: 'tsc -w',
                };
            }
            break;
    }

    for (const tool in params.tools) {
        switch (tool) {
            case 'eslint':
                json.devDependencies = {
                    ...json.devDependencies,
                    eslint: '^7.32.0',
                };

                json.scripts = {
                    ...json.scripts,
                    lint: 'eslint .',
                    format: 'eslint . --fix',
                };
                break;
            case 'prettier':
                json.devDependencies = {
                    ...json.devDependencies,
                    prettier: '^2.3.2',
                };

                json.scripts = {
                    ...json.scripts,
                    lint: 'prettier --check .',
                    format: 'prettier --write .',
                };
                break;
        }
    }

    return json;
};
