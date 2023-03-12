import inquirer from 'inquirer';

import promises from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';

import nanospinner from 'nanospinner';
import chalk from 'chalk';

import { gap } from '../utils/logger';

export default async () => {
    if (!fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
        console.error(chalk.redBright('Directory is not an npm project!'));
        process.exit(1);
    }

    const pkj = await promises.readFile(path.resolve(process.cwd(), 'package.json'), 'utf-8');

    const outExists = fs.existsSync(path.resolve(process.cwd(), 'out'));
    const distExists = fs.existsSync(path.resolve(process.cwd(), 'dist'));
    const buildExists = fs.existsSync(path.resolve(process.cwd(), 'build'));
    const publicExists = fs.existsSync(path.resolve(process.cwd(), 'public'));

    const questions = [
        {
            type: 'input',
            name: 'whitelist',
            message: 'Enter any files you want to include in the package:',
            default: 'README.md, LICENSE',
        },
    ];

    const answers = await inquirer.prompt(questions);

    const spinner = nanospinner.createSpinner('Writing to package.json').start();

    const packageJSON = JSON.parse(pkj);

    packageJSON.files = answers.whitelist.split(',').map((file) => file.trim());
    packageJSON.files = [
        ...packageJSON.files,
        ...(outExists ? ['out'] : []),
        ...(distExists ? ['dist'] : []),
        ...(buildExists ? ['build'] : []),
        ...(publicExists ? ['public'] : []),
    ];

    await promises.writeFile(path.resolve(process.cwd(), 'package.json'), JSON.stringify(packageJSON, null, 4));

    spinner.success({ text: 'Wrote to package.json' });

    gap();

    console.log(chalk.greenBright('Done!'));

    gap();
};
