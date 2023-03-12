import inquirer from 'inquirer';

import promises from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';

import nanospinner from 'nanospinner';
import chalk from 'chalk';

import { getPackageManager, installDependencies } from '../utils/manager';
import { gap, separator, wordmark } from '../utils/logger';
import { createPackageJSON } from '../utils/package';
import { copy, empty } from '../utils/fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const promptName = async () => {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your package?',
            default: path.basename(process.cwd()),
        },
    ];

    const { name } = await inquirer.prompt(questions);

    return name;
};

const promptLocation = async () => {
    const questions = [
        {
            type: 'input',
            name: 'location',
            message: 'Where do you want to create the package?',
            default: `./${path.basename(process.cwd())}`,
        },
    ];

    const { location } = await inquirer.prompt(questions);

    return location;
};

const promptTemplate = async () => {
    const questions = [
        {
            type: 'list',
            name: 'template',
            message: 'Select a template:',
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
    ];

    const { template } = await inquirer.prompt(questions);

    return template;
};

const promptUseProvidedTemplate = async (template: string) => {
    const questions = [
        {
            type: 'confirm',
            name: 'useProvidedTemplate',
            message: `Using template: ${chalk.greenBright(template)}`,
            default: true,
        },
    ];

    const { useProvidedTemplate } = await inquirer.prompt(questions);

    return useProvidedTemplate;
};

const promptTools = async (optionalTools?: string[]) => {
    const questions = [
        {
            type: 'checkbox',
            name: 'tools',
            message: 'Select tools:',
            choices: [
                {
                    name: chalk.red('ESLint'),
                    value: 'eslint',
                },
                {
                    name: chalk.yellow('Prettier'),
                    value: 'prettier',
                },
            ],
            default: optionalTools,
        },
    ];

    const { tools } = await inquirer.prompt(questions);

    return tools;
};

const promptInstallDependencies = async () => {
    const questions = [
        {
            type: 'confirm',
            name: 'installDependencies',
            message: 'Install dependencies? (y)',
            default: true,
        },
    ];

    const { installDependencies } = await inquirer.prompt(questions);

    return installDependencies;
};

const promptTypescript = async () => {
    const questions = [
        {
            type: 'confirm',
            name: 'typescript',
            message: 'Use TypeScript? (y)',
            default: true,
        },
    ];

    const { typescript } = await inquirer.prompt(questions);

    return typescript;
};

export default async () => {
    const optionalTemplate = process.argv[3];
    const optionalTools = process.argv.slice(4);

    const name = await promptName();
    const location = await promptLocation();

    let template;

    if (optionalTemplate) {
        if (!['rollup', 'vite', 'webpack', 'vanilla'].includes(optionalTemplate)) {
            console.log(chalk.redBright(`Invalid template: ${optionalTemplate}`));
            process.exit(0);
        }

        const useProvidedTemplate = await promptUseProvidedTemplate(optionalTemplate);

        if (!useProvidedTemplate) {
            template = await promptTemplate();
        } else {
            template = optionalTemplate;
        }
    } else {
        template = await promptTemplate();
    }

    const tools = await promptTools(optionalTools);

    let typescript;

    if (optionalTools.includes('typescript')) {
        typescript = true;

        console.log(chalk.blueBright('Using TypeScript!'));
    } else {
        typescript = await promptTypescript();
    }

    const installDeps = await promptInstallDependencies();

    gap();

    const json = createPackageJSON({
        name: name,
        location: location,
        template: template,
        tools: tools,
        typescript: typescript,
        installDependencies: installDeps,
    });

    const loc = path.resolve(process.cwd(), location);

    if (!(await empty(loc))) {
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

    if (!fs.existsSync(loc)) {
        fs.mkdirSync(loc);
    }

    const templateName = `${template}/${typescript ? 'typescript' : 'javascript'}`;

    const tempSpinner = nanospinner.createSpinner(`Copying template files...`).start();
    await copy(path.resolve(__dirname, '../templates', templateName), loc);
    tempSpinner.success({ text: 'Template files copied' });

    const pkjSpinner = nanospinner.createSpinner(`Creating package.json...`).start();
    await promises.writeFile(path.resolve(loc, 'package.json'), JSON.stringify(json, null, 4));
    pkjSpinner.success({ text: 'package.json created' });

    const manager = getPackageManager();

    if (installDeps) {
        const spinner = nanospinner.createSpinner('Installing dependencies...').start();

        await installDependencies(loc, manager);

        spinner.success({ text: 'Dependencies installed' });
    }

    gap();
    console.log(chalk.greenBright(`Done!`));
    gap();
    separator();
    gap();

    console.log(chalk.magentaBright(`Next steps:`));
    console.log(`   cd ${location}`);
    if (!installDeps) console.log(`- ${manager} install`);
    console.log(`   ${manager}${manager === 'npm' ? ' run' : ''} dev`);

    gap();

    console.log(chalk.magentaBright(`Happy coding!`));

    gap();
};
