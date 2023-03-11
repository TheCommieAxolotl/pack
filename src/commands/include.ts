import inquirer from 'inquirer';

import promises from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';

import chalk from 'chalk';
import ora from 'ora';

import { gap, separator, wordmark } from '../utils/logger';

export default async () => {
    if (!fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
        console.error(chalk.redBright('Directory is not an npm project!'));
        process.exit(1);
    }

    const pkj = await promises.readFile(path.resolve(process.cwd(), 'package.json'), 'utf-8');

    const alwaysInclude = ['dist'];

    const questions = [
        {
            type: 'input',
            name: 'whitelist',
            message: 'Enter any files you want to include in the package:',
            default: 'README.md, LICENSE',
        },
    ];

    const answers = await inquirer.prompt(questions);

    const spinner = ora('Writing to package.json').start();

    const packageJSON = JSON.parse(pkj);

    packageJSON.files = answers.whitelist.split(',').map((file) => file.trim());
    packageJSON.files = [...packageJSON.files, ...alwaysInclude];

    await promises.writeFile(path.resolve(process.cwd(), 'package.json'), JSON.stringify(packageJSON, null, 4));

    spinner.succeed('Wrote to package.json');

    gap();

    console.log(chalk.greenBright('Done!'));

    gap();
};
