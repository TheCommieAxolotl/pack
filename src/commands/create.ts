import inquirer from 'inquirer';

import promises from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';

import chalk from 'chalk';
import ora from 'ora';

import { getPackageManager, installDependencies } from '../utils/manager';
import { gap, separator, wordmark } from '../utils/logger';
import { createPackageJSON } from '../utils/package';
import { copy, empty } from '../utils/fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default async () => {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your package?',
            default: path.basename(process.cwd()),
        },
        {
            type: 'input',
            name: 'location',
            message: 'Where do you want to create the package?',
            default: `./${path.basename(process.cwd())}`,
        },
        {
            type: 'list',
            name: 'bundler',
            message: 'Select a bundler:',
            choices: [
                {
                    name: chalk.red('Rollup'),
                    value: 'rollup',
                },
                {
                    name: chalk.yellow('Vite'),
                    value: 'vite',
                },
                {
                    name: chalk.cyanBright('Webpack'),
                    value: 'webpack',
                },
                {
                    name: 'vanilla',
                    value: 'vanilla',
                },
            ],
        },
        {
            type: 'checkbox',
            name: 'tools',
            message: 'Add some tools:',
            choices: [
                {
                    name: 'ESLint',
                    value: 'eslint',
                },
                {
                    name: 'Prettier',
                    value: 'prettier',
                },
            ],
        },
        {
            type: 'confirm',
            name: 'typescript',
            message: 'Do you want to use TypeScript?',
            default: false,
        },
        {
            type: 'confirm',
            name: 'installDependencies',
            message: 'Do you want to install dependencies?',
            default: true,
        },
    ];

    const results = await inquirer.prompt(questions);

    gap();

    const json = createPackageJSON(results);

    const location = path.resolve(process.cwd(), results.location);

    if (!(await empty(location))) {
        const overrive = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'override',
                message: chalk.redBright('The directory is not empty, do you want to override it?'),
                default: false,
            },
        ]);

        if (!overrive.override) {
            console.log(chalk.redBright('Okay, Aborting now...'));
            process.exit(0);
        }
    }

    gap();
    console.log(chalk.magentaBright(`Great choices!, pack will now start prepping your package...`));
    gap();

    if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
    }

    const templateName = `${results.bundler}/${results.typescript ? 'typescript' : 'javascript'}`;

    const tempSpinner = ora(`Copying template files...`).start();
    await copy(path.resolve(__dirname, '../templates', templateName), location);
    tempSpinner.succeed('Template files copied');

    const pkjSpinner = ora(`Creating package.json...`).start();
    await promises.writeFile(path.resolve(location, 'package.json'), JSON.stringify(json, null, 4));
    pkjSpinner.succeed('package.json created');

    const manager = getPackageManager();

    if (results.installDependencies) {
        const spinner = ora('Installing dependencies...').start();

        await installDependencies(location, manager);

        spinner.succeed('Dependencies installed');
    }

    gap();
    console.log(chalk.greenBright(`Done!`));
    gap();
    separator();
    gap();

    console.log(chalk.magentaBright(`Next steps:`));
    console.log(`   cd ${results.location}`);
    if (!results.installDependencies) console.log(`- ${manager} install`);
    console.log(`   ${manager}${manager === 'npm' ? ' run' : ''} dev`);

    gap();

    console.log(chalk.magentaBright(`Happy coding!`));

    gap();
};
